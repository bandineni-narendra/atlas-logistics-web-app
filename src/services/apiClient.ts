/**
 * Unified API Client
 *
 * Single HTTP client for all backend API calls.
 * Uses Firebase TokenProvider for authentication.
 * Handles token refresh on 401, rate limiting on 429.
 */

import { TokenProvider } from "@/services/auth/TokenProvider";
import { firebaseTokenProvider } from "@/infrastructure/firebase";

const API_BASE_URL = "/api/v1";

// Dependency injection for token provider (testable)
let tokenProvider: TokenProvider = firebaseTokenProvider;

/**
 * Override the token provider (useful for testing)
 */
export function setTokenProvider(provider: TokenProvider): void {
    tokenProvider = provider;
}

/**
 * Typed API error with status code
 */
export class ApiClientError extends Error {
    public readonly statusCode: number;
    public readonly details?: string[];

    constructor(statusCode: number, message: string, details?: string[]) {
        super(message);
        this.name = "ApiClientError";
        this.statusCode = statusCode;
        this.details = details;
    }
}

/**
 * Core request function with auth, retry, and error handling
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false,
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    // Inject auth token
    const token = await tokenProvider.getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        // Handle 204 No Content
        if (response.status === 204) {
            return undefined as T;
        }

        // Handle 401 Unauthorized — try refreshing token once
        if (response.status === 401 && !isRetry) {
            const refreshedToken = await tokenProvider.getToken(true);
            if (refreshedToken) {
                return request<T>(endpoint, options, true);
            }
            // No token available — redirect to login
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            throw new ApiClientError(401, "Unauthorized");
        }

        // Handle 429 Rate Limiting
        if (response.status === 429) {
            const retryAfter = response.headers.get("retry-after") || "60";
            console.error(`Rate limited. Retry after ${retryAfter} seconds`);
            throw new ApiClientError(429, `Too many requests. Retry after ${retryAfter}s`);
        }

        // Handle other errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                message: "Request failed",
            }));

            const message = Array.isArray(errorData.message)
                ? errorData.message.join(", ")
                : errorData.message || "API request failed";

            throw new ApiClientError(
                response.status,
                message,
                Array.isArray(errorData.message) ? errorData.message : undefined,
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiClientError) {
            throw error;
        }

        // Network errors
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            throw new ApiClientError(0, "Network error — unable to reach server");
        }

        throw new ApiClientError(0, error instanceof Error ? error.message : "Unknown error");
    }
}

// ============================================
// Public HTTP Methods
// ============================================

export const apiClient = {
    get<T>(endpoint: string): Promise<T> {
        return request<T>(endpoint);
    },

    post<T>(endpoint: string, data?: unknown): Promise<T> {
        return request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    put<T>(endpoint: string, data?: unknown): Promise<T> {
        return request<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    delete<T>(endpoint: string): Promise<T> {
        return request<T>(endpoint, { method: "DELETE" });
    },
};
