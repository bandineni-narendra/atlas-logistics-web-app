/**
 * Authentication Types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: "manual" | "google";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface EncryptedSession {
  data: string;
  timestamp: number;
}
