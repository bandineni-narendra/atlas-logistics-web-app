/**
 * Token Provider Interface
 * 
 * Abstraction for retrieving authentication tokens.
 * Decouples API clients from specific authentication mechanisms.
 */

export interface TokenProvider {
  /**
   * Get current authentication token
   * @param forceRefresh - Force token refresh before returning
   * @returns Token string or null if not authenticated
   */
  getToken(forceRefresh?: boolean): Promise<string | null>;
}
