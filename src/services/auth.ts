/**
 * Authentication Service
 *
 * Application layer service that orchestrates authentication operations.
 * Uses AuthRepository abstraction instead of directly depending on Firebase.
 * Syncs with backend after authentication via the new typed authService.
 */

import { authService } from "@/services/authService";
import { User } from "@/types/api";
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
 */
export async function signup(
  email: string,
  password: string,
  name: string,
): Promise<User> {
  try {
    // 1. Create user via repository (Firebase)
    const credentials = await authRepository.createUser(email, password);

    // 2. Update display name
    await authRepository.updateUserProfile(credentials.uid, {
      displayName: name,
    });

    // 3. Get ID token
    const idToken = await authRepository.getCurrentUserToken();

    if (!idToken) {
      throw new Error("Failed to get authentication token");
    }

    // 4. Sync with backend (creates user profile in database)
    const user = await authService.verifyToken(idToken);
    logger.debug("[auth] Signup - Backend verified");

    // 5. Force refresh token to get custom claims (orgId) set by backend
    await authRepository.getCurrentUserToken(true);

    return user;
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === "auth/email-already-in-use") {
      throw new Error(
        "This email is already registered. Please login instead.",
      );
    }
    if (err.code === "auth/weak-password") {
      throw new Error("Password must be at least 6 characters long.");
    }
    if (err.code === "auth/invalid-email") {
      throw new Error("Invalid email address.");
    }
    throw error;
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    // 1. Sign in via repository (Firebase)
    await authRepository.signInUser(email, password);

    // 2. Get ID token
    const idToken = await authRepository.getCurrentUserToken();

    if (!idToken) {
      throw new Error("Failed to get authentication token");
    }

    // 3. Sync profile with backend
    const user = await authService.verifyToken(idToken);
    logger.debug("[auth] Login - Backend verified");

    // 4. Force refresh token to get custom claims (orgId) set by backend
    await authRepository.getCurrentUserToken(true);

    return user;
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === "auth/user-not-found") {
      throw new Error("No account found with this email.");
    }
    if (err.code === "auth/wrong-password") {
      throw new Error("Incorrect password.");
    }
    if (err.code === "auth/invalid-email") {
      throw new Error("Invalid email address.");
    }
    throw error;
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    // 1. Sign in with Google via repository (Firebase)
    await authRepository.signInWithProvider("google");

    // 2. Get ID token
    const idToken = await authRepository.getCurrentUserToken();

    if (!idToken) {
      throw new Error("Failed to get authentication token");
    }

    // 3. Verify with backend using the google endpoint
    const user = await authService.signInWithGoogleToken(idToken);
    logger.debug("[auth] Google Sign-in - Backend verified");

    // 4. Force refresh token to get custom claims (orgId) set by backend
    await authRepository.getCurrentUserToken(true);

    return user;
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled. Please try again.");
    }
    throw error;
  }
}

/**
 * Get the current user's profile from backend
 */
export async function getCurrentUser(): Promise<User> {
  const idToken = await authRepository.getCurrentUserToken();
  if (!idToken) {
    throw new Error("No authenticated user found");
  }

  try {
    const user = await authService.getCurrentUser();
    return user;
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    const statusCode = err?.response?.status;
    const isNetworkError = !err?.response;

    if (statusCode === 404 || isNetworkError) {
      logger.warn(
        `[auth] ⚠️ GET /auth/me not available (${isNetworkError ? "network error" : "404"}). Using token data.`,
      );

      // Parse user data from token as fallback
      const payload = JSON.parse(atob(idToken.split(".")[1]));
      return {
        id: payload.user_id || payload.userId || payload.sub,
        email: payload.email || "",
        name: payload.name || payload.email || "",
        avatar: payload.picture || undefined,
        orgId: payload.orgId || payload.org_id || "",
        provider: payload.firebase?.sign_in_provider === "google.com" ? "google" : "manual",
      };
    }

    throw error;
  }
}

/**
 * Update the current user's profile
 */
export async function updateProfile(
  name?: string,
  avatar?: string,
): Promise<User> {
  return authService.updateProfile({ name, avatar });
}

/**
 * Delete the current user's account
 */
export async function deleteAccount(): Promise<void> {
  const idToken = await authRepository.getCurrentUserToken();
  if (!idToken) {
    throw new Error("No authenticated user");
  }

  // Get user ID from token
  const payload = JSON.parse(atob(idToken.split(".")[1]));
  const uid = payload.user_id || payload.userId || payload.sub;

  await authService.deleteAccount();

  // Delete from auth provider
  await authRepository.deleteUser(uid);
}

/**
 * Sign out the current user
 */
export async function logout(): Promise<void> {
  await authRepository.signOut();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/**
 * Get auth repository instance (for testing or advanced usage)
 */
export function getAuthRepository(): AuthRepository {
  return authRepository;
}
