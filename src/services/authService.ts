/**
 * Authentication Service
 *
 * Typed service for all auth API endpoints.
 * Uses the unified apiClient.
 */

import { apiClient } from "./apiClient";
import type {
    User,
    SignupRequest,
    LoginRequest,
    VerifyTokenRequest,
    UpdateProfileRequest,
} from "@/types/api";

export class AuthService {
    /**
     * Verify Firebase ID token and sync user profile
     */
    async verifyToken(idToken: string): Promise<User> {
        return apiClient.post<User>("/auth/verify", { idToken } satisfies VerifyTokenRequest);
    }

    /**
     * Google sign-in with ID token
     */
    async signInWithGoogleToken(idToken: string): Promise<User> {
        return apiClient.post<User>("/auth/google", { idToken });
    }

    /**
     * Register new user account (legacy — prefer Firebase SDK flow)
     */
    async signup(data: SignupRequest): Promise<User> {
        return apiClient.post<User>("/auth/signup", data);
    }

    /**
     * Login with email/password (legacy — prefer Firebase SDK flow)
     */
    async login(data: LoginRequest): Promise<User> {
        return apiClient.post<User>("/auth/login", data);
    }

    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<User> {
        return apiClient.get<User>("/auth/me");
    }

    /**
     * Update user profile
     */
    async updateProfile(data: UpdateProfileRequest): Promise<User> {
        return apiClient.put<User>("/auth/profile", data);
    }

    /**
     * Delete user account
     */
    async deleteAccount(): Promise<void> {
        return apiClient.delete("/auth/account");
    }
}

export const authService = new AuthService();
