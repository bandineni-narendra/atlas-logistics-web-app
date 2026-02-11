/**
 * Authentication Repository Interface
 * 
 * Abstraction for authentication operations.
 * Implementations provide concrete auth mechanisms (Firebase, Auth0, etc.)
 */

export interface UserCredentials {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthRepository {
  /**
   * Create a new user account
   */
  createUser(email: string, password: string): Promise<UserCredentials>;

  /**
   * Sign in an existing user
   */
  signInUser(email: string, password: string): Promise<UserCredentials>;

  /**
   * Sign in with OAuth provider
   */
  signInWithProvider(provider: "google"): Promise<UserCredentials>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Update user profile
   */
  updateUserProfile(uid: string, profile: { displayName?: string; photoURL?: string }): Promise<void>;

  /**
   * Delete user account
   */
  deleteUser(uid: string): Promise<void>;

  /**
   * Get current user's ID token
   */
  getCurrentUserToken(forceRefresh?: boolean): Promise<string | null>;

  /**
   * Listen to authentication state changes
   * Returns unsubscribe function
   */
  onAuthStateChanged(callback: (user: UserCredentials | null) => void): () => void;
}
