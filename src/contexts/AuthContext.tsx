/**
 * Authentication Context
 *
 * Provides global authentication state and methods.
 * Uses Firebase Authentication with backend profile sync.
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { User } from "@/types/auth";
import * as authService from "@/services/auth";

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

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Force refresh token to ensure we have latest custom claims (orgId)
          const token = await firebaseUser.getIdToken(true);

          // Debug: Verify orgId is in token
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("AuthContext - Token claims on load:", {
            orgId: payload.orgId || payload.org_id,
            userId: payload.user_id || payload.userId,
            email: payload.email,
            hasOrgId: !!(payload.orgId || payload.org_id),
            allClaims: Object.keys(payload),
          });

          // Sync with backend to get full user profile
          try {
            const userData = await authService.getCurrentUser();
            console.log("AuthContext - User data:", userData);

            // WORKAROUND: Store orgId if present
            if (userData.orgId) {
              localStorage.setItem("user_orgId", userData.orgId);
            }

            setUser(userData);
          } catch (error) {
            console.error("Failed to sync user with backend:", error);
            // Still set user as authenticated based on Firebase state
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || firebaseUser.email || "",
              avatar: firebaseUser.photoURL || undefined,
            });
          }
        } catch (error) {
          console.error("Failed to sync user with backend:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const newUser = await authService.signup(email, password, name);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    const existingUser = await authService.login(email, password);
    setUser(existingUser);
  };

  const signInWithGoogle = async () => {
    const googleUser = await authService.signInWithGoogle();
    setUser(googleUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (name?: string, avatar?: string) => {
    if (!user) throw new Error("Not authenticated");
    const updated = await authService.updateProfile(name, avatar);
    setUser(updated);
  };

  const deleteAccount = async () => {
    if (!user) throw new Error("Not authenticated");
    await authService.deleteAccount();
    setUser(null);
  };

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
