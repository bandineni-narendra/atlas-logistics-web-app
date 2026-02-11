/**
 * Firebase Token Provider
 * 
 * Concrete implementation of TokenProvider using Firebase Authentication.
 */

import { TokenProvider } from "@/services/auth/TokenProvider";
import { firebaseAuthRepository } from "./FirebaseAuthRepository";

export class FirebaseTokenProvider implements TokenProvider {
  async getToken(forceRefresh = false): Promise<string | null> {
    return await firebaseAuthRepository.getCurrentUserToken(forceRefresh);
  }
}

// Export singleton instance
export const firebaseTokenProvider = new FirebaseTokenProvider();
