/**
 * Authentication Service
 *
 * Handles authentication operations using Firebase SDK and backend API.
 * All functions sync with backend after Firebase authentication.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { apiClient } from "@/api/client";
import { User } from "@/types/auth";

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
    // 1. Create user in Firebase
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // 2. Update display name in Firebase
    await firebaseUpdateProfile(credential.user, { displayName: name });

    // 3. Get Firebase ID token
    const idToken = await credential.user.getIdToken();

    // 4. Sync with backend (creates user profile in database)
    const { data } = await apiClient.post("/auth/verify", { idToken });
    console.log("Signup - Backend response:", data);

    // 5. Force refresh token to get custom claims (orgId) set by backend
    const refreshedToken = await credential.user.getIdToken(true);
    const payload = JSON.parse(atob(refreshedToken.split(".")[1]));
    console.log("Signup - Token claims after refresh:", {
      orgId: payload.orgId || payload.org_id,
      userId: payload.user_id || payload.userId,
      allClaims: Object.keys(payload),
    });

    // WORKAROUND: Store orgId from backend response in localStorage
    // This is temporary until backend sets custom claims properly
    if (data.orgId) {
      localStorage.setItem("user_orgId", data.orgId);
      console.log("✅ Stored orgId from backend response:", data.orgId);
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
    // 1. Sign in with Firebase
    const credential = await signInWithEmailAndPassword(auth, email, password);

    // 2. Get Firebase ID token
    const idToken = await credential.user.getIdToken();

    // 3. Sync profile with backend
    const { data } = await apiClient.post("/auth/verify", { idToken });
    console.log("Login - Backend response:", data);

    // 4. Force refresh token to get custom claims (orgId) set by backend
    const refreshedToken = await credential.user.getIdToken(true);
    const payload = JSON.parse(atob(refreshedToken.split(".")[1]));
    console.log("Login - Token claims after refresh:", {
      orgId: payload.orgId || payload.org_id,
      userId: payload.user_id || payload.userId,
      allClaims: Object.keys(payload),
    });

    // WORKAROUND: Store orgId from backend response in localStorage
    if (data.orgId) {
      localStorage.setItem("user_orgId", data.orgId);
      console.log("✅ Stored orgId from backend response:", data.orgId);
    }

    return data;
  } catch (error: any) {
    // Map Firebase errors to user-friendly messages
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      throw new Error("Invalid email or password.");
    }
    if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address.");
    }
    if (error.code === "auth/too-many-requests") {
      throw new Error(
        "Too many failed login attempts. Please try again later.",
      );
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
    // 1. Sign in with Google popup
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);

    // 2. Get Firebase ID token
    const idToken = await credential.user.getIdToken();

    // 3. Sync with backend
    const { data } = await apiClient.post("/auth/google", { idToken });
    console.log("Google Sign-in - Backend response:", data);

    // 4. Force refresh token to get custom claims (orgId) set by backend
    const refreshedToken = await credential.user.getIdToken(true);
    const payload = JSON.parse(atob(refreshedToken.split(".")[1]));
    console.log("Google Sign-in - Token claims after refresh:", {
      orgId: payload.orgId || payload.org_id,
      userId: payload.user_id || payload.userId,
      allClaims: Object.keys(payload),
    });

    // WORKAROUND: Store orgId from backend response in localStorage
    if (data.orgId) {
      localStorage.setItem("user_orgId", data.orgId);
      console.log("✅ Stored orgId from backend response:", data.orgId);
    }

    return data;
  } catch (error: any) {
    // Map Firebase errors to user-friendly messages
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in popup was closed. Please try again.");
    }
    if (error.code === "auth/cancelled-popup-request") {
      throw new Error("Sign-in was cancelled. Please try again.");
    }
    throw error;
  }
}

/**
 * Get the current user's profile from backend
 * Requires authentication
 *
 * Falls back to Firebase user data if backend endpoint not available
 * @returns User profile
 */
export async function getCurrentUser(): Promise<User> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error("No authenticated user found");
  }

  try {
    const { data } = await apiClient.get("/auth/me");
    return data;
  } catch (error: any) {
    // WORKAROUND: If backend /auth/me endpoint not available (404 or network error)
    // Return minimal user data from Firebase
    const statusCode = error?.response?.status;
    const isNetworkError = !error?.response;

    if (statusCode === 404 || isNetworkError) {
      console.warn(
        `⚠️ GET /auth/me not available (${isNetworkError ? "network error" : "404"}). Using Firebase user data.`,
      );

      // Return minimal user object from Firebase
      const orgId =
        typeof window !== "undefined"
          ? localStorage.getItem("user_orgId")
          : null;

      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || firebaseUser.email || "",
        avatar: firebaseUser.photoURL || undefined,
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
  await apiClient.delete("/auth/account");
  // Also delete from Firebase
  const user = auth.currentUser;
  if (user) {
    await user.delete();
  }
}

/**
 * Sign out the current user
 * Clears Firebase session and redirects to login
 */
export async function logout(): Promise<void> {
  await signOut(auth);
  // Clear stored orgId
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_orgId");
    window.location.href = "/login";
  }
}
