/**
 * Authentication Service
 *
 * Application layer service that orchestrates authentication operations.
 * Uses AuthRepository abstraction instead of directly depending on Firebase.
 * Syncs with backend after authentication.
 */

import { apiClient } from "@/api/client";
import { User } from "@/types/auth";
import { AuthRepository } from "./auth/AuthRepository";
import { firebaseAuthRepository } from "@/infrastructure/firebase";
import { logger } from "@/utils";

// Use dependency injection - can be replaced for testing
let authRepository: AuthRepository = firebaseAuthRepository;

/**
 * Set custom auth repository (for testing)
 */
export function setAuthRepository(repository: AuthRepository) {
  authRepository = repository;
}

/**
 * Sign up a new user with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @param name - User's display name
 * @returns User profile from backend
 */
export async function signup(
  email: string,
  password: string,
  name: string,
): Promise<User> {
  try {
    // 1. Create user via repository
    const credentials = await authRepository.createUser(email, password);

    // 2. Update display name
    await authRepository.updateUserProfile(credentials.uid, { 
      displayName: name 
    });

    // 3. Get ID token
    const idToken = await authRepository.getCurrentUserToken();

    if (!idToken) {
      throw new Error("Failed to get authentication token");
    }

    // 4. Sync with backend (creates user profile in database)
    const { data } = await apiClient.post("/auth/verify", { idToken });
    logger.debug("[auth] Signup - Backend verified");

    // 5. Force refresh token to get custom claims (orgId) set by backend
    const refreshedToken = await authRepository.getCurrentUserToken(true);
    if (!refreshedToken) {
      throw new Error("Failed to refresh authentication token");
    }
    const payload = JSON.parse(atob(refreshedToken.split(".")[1]));
    logger.debug("[auth] Signup - Token claims refreshed", {
      hasOrgId: !!(payload.orgId || payload.org_id),
    });

    // WORKAROUND: Store orgId from backend response in localStorage
    // This is temporary until backend sets custom claims properly
    if (data.orgId) {
      localStorage.setItem("user_orgId", data.orgId);
      logger.debug("[auth] ✅ Stored orgId from backend response");
    }

    return data;
  } catch (error: any) {
    // Map Firebase errors to user-friendly messages
    if (error.code === "auth/email-already-in-use") {
      throw new Error(
        "This email is already registered. Please login instead.",
      );
    }
    if (error.code === "auth/weak-password") {
      throw new Error("Password must be at least 6 characters long.");
    }
    if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address.");
    }
    throw error;
  }
}

/**
 * Sign in an existing user with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns User profile from backend
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    // 1. Sign in via repository
    await authRepository.signInUser(email, password);

    // 2. Get ID token
    const idToken = await authRepository.getCurrentUserToken();

    if (!idToken) {
      throw new Error("Failed to get authentication token");
    }

    // 3. Sync profile with backend
    const { data } = await apiClient.post("/auth/verify", { idToken });
    logger.debug("[auth] Login - Backend verified");

    // 4. Force refresh token to get custom claims (orgId) set by backend
    const refreshedToken = await authRepository.getCurrentUserToken(true);
    if (!refreshedToken) {
      throw new Error("Failed to refresh authentication token");
    }
    const payload = JSON.parse(atob(refreshedToken.split(".")[1]));
    logger.debug("[auth] Login - Token claims refreshed", {
      hasOrgId: !!(payload.orgId || payload.org_id),
    });

    // WORKAROUND: Store orgId in localStorage if present
    if (data.orgId) {
      localStorage.setItem("user_orgId", data.orgId);
      logger.debug("[auth] ✅ Stored orgId from backend response");
    }

    return data;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email.");
    }
    if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password.");
    }
    if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address.");
    }
    throw error;
  }
}

/**
 * Sign in with Google OAuth
 *
 * @returns User profile from backend
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    // 1. Sign in with Google via repository
    await authRepository.signInWithProvider("google");

    // 2. Get ID token
    const idToken = await authRepository.getCurrentUserToken();

    if (!idToken) {
      throw new Error("Failed to get authentication token");
    }

    // 3. Sync with backend (using verify endpoint since /auth/google may not exist)
    const { data } = await apiClient.post("/auth/verify", { idToken });
    logger.debug("[auth] Google Sign-in - Backend verified");

    // 4. Force refresh token to get custom claims (orgId) set by backend
    const refreshedToken = await authRepository.getCurrentUserToken(true);
    if (!refreshedToken) {
      throw new Error("Failed to refresh authentication token");
    }
    const payload = JSON.parse(atob(refreshedToken.split(".")[1]));
    logger.debug("[auth] Google Sign-in - Token claims refreshed", {
      hasOrgId: !!(payload.orgId || payload.org_id),
    });

    // WORKAROUND: Store orgId in localStorage if present
    if (data.orgId) {
      localStorage.setItem("user_orgId", data.orgId);
      logger.debug("[auth] ✅ Stored orgId from backend response");
    }

    return data;
  } catch (error: any) {
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled. Please try again.");
    }
    throw error;
  }
}

/**
 * Get the current user's profile from backend
 * Requires authentication
 *
 * Falls back to token data if backend endpoint not available
 * @returns User profile
 */
export async function getCurrentUser(): Promise<User> {
  const idToken = await authRepository.getCurrentUserToken();
  if (!idToken) {
    throw new Error("No authenticated user found");
  }

  try {
    const { data } = await apiClient.get("/auth/me");
    return data;
  } catch (error: any) {
    // WORKAROUND: If backend /auth/me endpoint not available (404 or network error)
    // Return minimal user data from token
    const statusCode = error?.response?.status;
    const isNetworkError = !error?.response;

    if (statusCode === 404 || isNetworkError) {
      logger.warn(
        `[auth] ⚠️ GET /auth/me not available (${isNetworkError ? "network error" : "404"}). Using token data.`,
      );

      // Parse user data from token
      const payload = JSON.parse(atob(idToken.split(".")[1]));
      const orgId =
        payload.orgId || 
        payload.org_id ||
        (typeof window !== "undefined" ? localStorage.getItem("user_orgId") : null);

      return {
        id: payload.user_id || payload.userId || payload.sub,
        email: payload.email || "",
        name: payload.name || payload.email || "",
        avatar: payload.picture || undefined,
        orgId: orgId || undefined,
      };
    }

    // If it's a different error, throw it
    throw error;
  }
}

/**
 * Update the current user's profile
 * Requires authentication
 *
 * @param name - Optional new display name
 * @param avatar - Optional new avatar URL
 * @returns Updated user profile
 */
export async function updateProfile(
  name?: string,
  avatar?: string,
): Promise<User> {
  const { data } = await apiClient.put("/auth/profile", { name, avatar });
  return data;
}

/**
 * Delete the current user's account
 * Requires authentication
 */
export async function deleteAccount(): Promise<void> {
  const idToken = await authRepository.getCurrentUserToken();
  if (!idToken) {
    throw new Error("No authenticated user");
  }

  // Get user ID from token
  const payload = JSON.parse(atob(idToken.split(".")[1]));
  const uid = payload.user_id || payload.userId || payload.sub;

  await apiClient.delete("/auth/account");
  
  // Delete from auth provider
  await authRepository.deleteUser(uid);
}

/**
 * Sign out the current user
 * Clears session and redirects to login
 */
export async function logout(): Promise<void> {
  await authRepository.signOut();
  // Clear stored orgId
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_orgId");
    window.location.href = "/login";
  }
}

/**
 * Get auth repository instance (for testing or advanced usage)
 */
export function getAuthRepository(): AuthRepository {
  return authRepository;
}
