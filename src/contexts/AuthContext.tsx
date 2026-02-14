/**
 * Authentication Context
 *
 * Provides global authentication state and methods.
 * Uses authentication service abstraction (no direct Firebase dependency).
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User } from "@/types/api";
import * as authService from "@/services/auth";
import { firebaseAuthRepository } from "@/infrastructure/firebase";
import { logger } from "@/utils";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name?: string, avatar?: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to auth state changes via repository
  useEffect(() => {
    const unsubscribe = firebaseAuthRepository.onAuthStateChanged(async (credentials) => {
      if (credentials) {
        try {
          // Force refresh token to ensure we have latest custom claims (orgId)
          const token = await firebaseAuthRepository.getCurrentUserToken(true);
          if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
          }

          // Debug: Verify orgId is in token
          const payload = JSON.parse(atob(token.split(".")[1]));
          logger.debug("[AuthContext] Token claims on load", {
            orgId: payload.orgId || payload.org_id,
            userId: payload.user_id || payload.userId,
            email: payload.email,
            hasOrgId: !!(payload.orgId || payload.org_id),
          });

          // Sync with backend to get full user profile
          try {
            const userData = await authService.getCurrentUser();
            logger.debug("[AuthContext] User data loaded", { userId: userData.id });

            // WORKAROUND: Store orgId if present
            if (userData.orgId) {
              localStorage.setItem("user_orgId", userData.orgId);
            }

            setUser(userData);
          } catch (error) {
            logger.error("[AuthContext] Failed to sync user with backend:", error);
            // Still set user as authenticated based on credentials
            setUser({
              id: credentials.uid,
              email: credentials.email || "",
              name: credentials.displayName || credentials.email || "",
              avatar: credentials.photoURL || undefined,
              orgId: "",
              provider: "manual",
            });
          }
        } catch (error) {
          logger.error("[AuthContext] Failed to sync user with backend:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const newUser = await authService.signup(email, password, name);
    setUser(newUser);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const existingUser = await authService.login(email, password);
    setUser(existingUser);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const googleUser = await authService.signInWithGoogle();
    setUser(googleUser);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (name?: string, avatar?: string) => {
    if (!user) throw new Error("Not authenticated");
    const updated = await authService.updateProfile(name, avatar);
    setUser(updated);
  }, [user]);

  const deleteAccount = useCallback(async () => {
    if (!user) throw new Error("Not authenticated");
    await authService.deleteAccount();
    setUser(null);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        signInWithGoogle,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
