/**
 * Firebase Authentication Repository
 * 
 * Concrete implementation of AuthRepository using Firebase.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { AuthRepository, UserCredentials } from "@/services/auth/AuthRepository";

export class FirebaseAuthRepository implements AuthRepository {
  private mapFirebaseUser(firebaseUser: FirebaseUser | null): UserCredentials | null {
    if (!firebaseUser) return null;

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    };
  }

  async createUser(email: string, password: string): Promise<UserCredentials> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = this.mapFirebaseUser(credential.user);
    if (!user) throw new Error("Failed to create user");
    return user;
  }

  async signInUser(email: string, password: string): Promise<UserCredentials> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = this.mapFirebaseUser(credential.user);
    if (!user) throw new Error("Failed to sign in");
    return user;
  }

  async signInWithProvider(provider: "google"): Promise<UserCredentials> {
    const authProvider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, authProvider);
    const user = this.mapFirebaseUser(credential.user);
    if (!user) throw new Error("Failed to sign in with provider");
    return user;
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  async updateUserProfile(
    uid: string,
    profile: { displayName?: string; photoURL?: string }
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user || user.uid !== uid) {
      throw new Error("User not authenticated or UID mismatch");
    }
    await updateProfile(user, profile);
  }

  async deleteUser(uid: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || user.uid !== uid) {
      throw new Error("User not authenticated or UID mismatch");
    }
    await user.delete();
  }

  async getCurrentUserToken(forceRefresh = false): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;

    // Retry logic for token refresh errors (e.g., network issues)
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        return await user.getIdToken(forceRefresh);
      } catch (error: any) {
        attempt++;
        const isNetworkError = error?.code === "auth/network-request-failed";

        // If it's a network error and we haven't exhausted retries, wait and retry
        if (isNetworkError && attempt < MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff: 2s, 4s, 5s max
          console.warn(`[FirebaseAuth] Token refresh failed (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delay}ms...`, error);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // If it's not a network error or we're out of retries, log and return safe value or throw
        console.error("[FirebaseAuth] Failed to get ID token:", error);

        // If we are just trying to get a token (not force refresh), we might return the existing one if available?
        // But getIdToken(false) verifies validity. If network fails, we can't verify.
        // Returning null might be safer than crashing if the app can handle unauthenticated state.
        if (attempt >= MAX_RETRIES) {
          // For network errors on token fetch, returning null acts as "logged out" or "offline"
          // preventing the app from crashing.
          return null;
        }

        throw error;
      }
    }
    return null;
  }

  onAuthStateChanged(callback: (user: UserCredentials | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      callback(this.mapFirebaseUser(firebaseUser));
    });
  }
}

// Export singleton instance
export const firebaseAuthRepository = new FirebaseAuthRepository();
