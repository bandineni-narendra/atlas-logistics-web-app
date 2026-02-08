/**
 * Authentication Context
 * 
 * Provides global authentication state and methods.
 * Handles session persistence and restoration.
 */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/auth";
import { authClient } from "@/api/auth_client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name?: string, avatar?: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("atlas_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("atlas_user");
      }
    }
    setIsLoading(false);
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const newUser = await authClient.signup(email, password, name);
    setUser(newUser);
    localStorage.setItem("atlas_user", JSON.stringify(newUser));
  };

  const login = async (email: string) => {
    const existingUser = await authClient.getUserByEmail(email);
    setUser(existingUser);
    localStorage.setItem("atlas_user", JSON.stringify(existingUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("atlas_user");
    router.push("/login");
  };

  const updateProfile = async (name?: string, avatar?: string) => {
    if (!user) throw new Error("Not authenticated");
    const updated = await authClient.updateProfile(user.email, name, avatar);
    setUser(updated);
    localStorage.setItem("atlas_user", JSON.stringify(updated));
  };

  const deleteAccount = async () => {
    if (!user) throw new Error("Not authenticated");
    await authClient.deleteAccount(user.email);
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
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
