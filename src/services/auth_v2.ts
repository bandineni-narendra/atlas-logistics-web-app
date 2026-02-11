/**
 * Authentication Service - Aligned with Backend Integration Guide
 *
 * Backend Authentication Flow:
 * 1. POST /auth/signup with { email, password, name, orgName }
 * 2. Receive { uid, email, displayName, orgId, customToken }
 * 3. Call firebase.auth().signInWithCustomToken(customToken)
 * 4. User is signed in with orgId in JWT custom claims
 */

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCustomToken,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { apiClient } from "@/api/client";
import { User } from "@/types/auth";
import axios from "axios";

/**
 * Sign up a new user with email and password
 * Follows backend integration guide flow
 *
 * @param email - User's email address
 * @param password - User's password
 * @param name - User's display name
 * @param orgName - Organization name (required by backend)
 * @returns User profile from backend
 */
export async function signup(
  email: string,
  password: string,
  name: string,
  orgName: string,
): Promise<User> {
  try {
    // Call backend signup endpoint (creates user in Firebase + sets orgId)
    const { data } = await axios.post<{
      uid: string;
      email: string;
      displayName: string;
      orgId: string;
      customToken: string;
    }>("/api/auth/signup", {
      email,
      password,
      name,
      orgName,
    });

    console.log("Signup - Backend response:", data);

    // Sign in with custom token (includes orgId in custom claims)
    await signInWithCustomToken(auth, data.customToken);

    console.log("✅ Signed in with custom token (orgId in JWT claims)");

    return {
      id: data.uid,
      email: data.email,
      name: data.displayName,
      orgId: data.orgId,
    };
  } catch (error: any) {
    // Map backend errors to user-friendly messages
    const errorMessage = error?.response?.data?.message;
    const statusCode = error?.response?.status;

    if (statusCode === 409 || errorMessage?.includes("already exists")) {
      throw new Error(
        "This email is already registered. Please login instead.",
      );
    }
    if (statusCode === 400) {
      if (Array.isArray(errorMessage)) {
        throw new Error(errorMessage.join(". "));
      }
      throw new Error(
        errorMessage || "Invalid input. Please check your information.",
      );
    }
    throw error;
  }
}

/**
 * Sign in an existing user with email and password
 * Follows backend integration guide flow
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns User profile from backend
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    // Call backend login endpoint
    const { data } = await axios.post<{
      uid: string;
      email: string;
      displayName: string;
      orgId: string;
      customToken: string;
    }>("/api/auth/login", {
      email,
      password,
    });

    console.log("Login - Backend response:", data);

    // Sign in with custom token (includes orgId in custom claims)
    await signInWithCustomToken(auth, data.customToken);

    console.log("✅ Signed in with custom token (orgId in JWT claims)");

    return {
      id: data.uid,
      email: data.email,
      name: data.displayName,
      orgId: data.orgId,
    };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message;
    const statusCode = error?.response?.status;

    if (statusCode === 401 || statusCode === 404) {
      throw new Error("Invalid email or password.");
    }
    if (statusCode === 429) {
      throw new Error(
        "Too many failed login attempts. Please try again later.",
      );
    }
    throw error;
  }
}

/**
 * Sign in with Google OAuth
 * Note: Backend guide doesn't specify /auth/google endpoint
 * This may need backend implementation
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

    // 3. Verify with backend
    const { data } = await apiClient.post("/auth/verify", { idToken });
    console.log("Google Sign-in - Backend response:", data);

    return {
      id: data.uid,
      email: data.email,
      name: data.displayName || data.email,
      orgId: data.orgId,
    };
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
 * Get the current user's profile
 * Extracts from Firebase auth state
 *
 * @returns User profile
 */
export async function getCurrentUser(): Promise<User> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error("No authenticated user found");
  }

  // Get token to extract orgId from custom claims
  const idToken = await firebaseUser.getIdToken();
  const payload = JSON.parse(atob(idToken.split(".")[1]));

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: firebaseUser.displayName || firebaseUser.email || "",
    avatar: firebaseUser.photoURL || undefined,
    orgId: payload.orgId || payload.org_id || undefined,
  };
}

/**
 * Sign out the current user
 * Clears Firebase session and redirects to login
 */
export async function logout(): Promise<void> {
  await signOut(auth);
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
