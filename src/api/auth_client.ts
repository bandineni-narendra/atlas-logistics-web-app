/**
 * Authentication API Client
 * Integrates with backend API via Next.js rewrites
 */

import { User } from "@/types/auth";

// Use relative path - Next.js will rewrite to backend API
const API_URL = "/api";

/**
 * Get stored auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("atlas_user");
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    // Use email as token for now (backend might generate proper tokens later)
    return user.email || null;
  } catch {
    return null;
  }
}

/**
 * Map backend error messages to user-friendly messages
 */
function mapErrorMessage(error: any): string {
  // Extract error message from various formats
  const rawMessage = error?.message || error?.error || "";
  const statusCode = error?.statusCode;

  // Map common backend errors to user-friendly messages
  const errorMap: Record<string, string> = {
    "No authorization header provided": "errors.auth.notAuthenticated",
    Unauthorized: "errors.auth.unauthorized",
    "User not found": "errors.auth.userNotFound",
    "Invalid credentials": "errors.auth.invalidCredentials",
    "Email already exists": "errors.auth.emailExists",
    "User already exists": "errors.auth.emailExists",
    "Invalid email format": "errors.validation.invalidEmail",
    "Password too weak": "errors.validation.weakPassword",
    "Bad Request": "errors.general.badRequest",
    "Internal Server Error": "errors.general.serverError",
    "Network Error": "errors.general.networkError",
    "Request failed": "errors.general.requestFailed",
  };

  // Check for exact matches
  if (errorMap[rawMessage]) {
    return errorMap[rawMessage];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(errorMap)) {
    if (rawMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Map by status code
  if (statusCode === 401) return "errors.auth.unauthorized";
  if (statusCode === 404) return "errors.auth.userNotFound";
  if (statusCode === 409) return "errors.auth.emailExists";
  if (statusCode === 400) return "errors.general.badRequest";
  if (statusCode >= 500) return "errors.general.serverError";

  // Default error message key
  return "errors.general.requestFailed";
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options?.headers as Record<string, string>),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Request failed",
        statusCode: response.status,
      }));

      // Throw error with localization key
      const errorKey = mapErrorMessage(error);
      const err = new Error(errorKey) as any;
      err.isLocalizationKey = true;
      err.statusCode = error.statusCode || response.status;
      throw err;
    }

    return response.json();
  } catch (error: any) {
    // Network errors
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      const err = new Error("errors.general.networkError") as any;
      err.isLocalizationKey = true;
      throw err;
    }
    // Re-throw our custom errors
    throw error;
  }
}

export const authClient = {
  /**
   * Create new user account
   */
  signup: (email: string, password: string, name: string): Promise<User> =>
    apiRequest<User>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  /**
   * Get user by email (login)
   */
  getUserByEmail: (email: string): Promise<User> =>
    apiRequest<User>(`/auth/profile?email=${encodeURIComponent(email)}`),

  /**
   * Update user profile
   */
  updateProfile: (
    email: string,
    name?: string,
    avatar?: string,
  ): Promise<User> =>
    apiRequest<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ email, name, avatar }),
    }),

  /**
   * Delete user account
   */
  deleteAccount: (email: string): Promise<void> =>
    apiRequest<void>("/auth/account", {
      method: "DELETE",
      body: JSON.stringify({ email }),
    }),
};
