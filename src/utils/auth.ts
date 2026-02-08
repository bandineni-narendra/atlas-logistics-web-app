/**
 * Session Management Utilities
 * Provides encryption and storage for user sessions
 */

import { User, EncryptedSession } from "@/types/auth";

const SESSION_KEY = "atlas_auth_session";
const ENCRYPTION_KEY = "atlas-logistics-2024-secure-key"; // In production, use env variable

/**
 * Simple encryption using base64 and XOR cipher
 * For production, use a proper encryption library like crypto-js
 */
function encrypt(text: string): string {
  const encoded = Buffer.from(text).toString("base64");
  let result = "";
  
  for (let i = 0; i < encoded.length; i++) {
    result += String.fromCharCode(
      encoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    );
  }
  
  return Buffer.from(result).toString("base64");
}

/**
 * Decrypt encrypted text
 */
function decrypt(encryptedText: string): string {
  try {
    const decoded = Buffer.from(encryptedText, "base64").toString();
    let result = "";
    
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    
    return Buffer.from(result, "base64").toString();
  } catch {
    return "";
  }
}

/**
 * Save user session to localStorage with encryption
 */
export function saveSession(user: User, token: string): void {
  if (typeof window === "undefined") return;
  
  const sessionData = {
    user,
    token,
  };
  
  const encrypted = encrypt(JSON.stringify(sessionData));
  const session: EncryptedSession = {
    data: encrypted,
    timestamp: Date.now(),
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Get user session from localStorage
 */
export function getSession(): { user: User; token: string } | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    
    const session: EncryptedSession = JSON.parse(stored);
    const decrypted = decrypt(session.data);
    
    if (!decrypted) return null;
    
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

/**
 * Clear user session from localStorage
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Check if session exists and is valid
 */
export function hasValidSession(): boolean {
  const session = getSession();
  return session !== null && !!session.user && !!session.token;
}
