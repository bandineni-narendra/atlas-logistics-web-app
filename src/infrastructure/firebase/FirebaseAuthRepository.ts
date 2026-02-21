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

    const maxRetries = 3;
    let delay = 1000; // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await user.getIdToken(forceRefresh);
      } catch (error: any) {
        const isNetworkError = error.code === "auth/network-request-failed";
        const isLastAttempt = attempt === maxRetries - 1;

        if (isNetworkError && !isLastAttempt) {
          console.warn(
            `Firebase ID token fetch failed (attempt ${attempt + 1}). Retrying in ${delay}ms...`,
            error
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          // Exponential backoff or static delay - sticking to static 1s as per plan
          continue;
        }

        // Re-throw if it's not a network error or we've exhausted retries
        console.error("Firebase ID token fetch failed definitively:", error);
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
