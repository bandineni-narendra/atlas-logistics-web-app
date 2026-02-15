/**
 * API Error Handling Utilities
 *
 * Typed helpers for consistent error handling across the app.
 */

import { ApiClientError } from "@/services/apiClient";

/**
 * Extract a user-friendly error message from any error
 */
export function handleApiError(error: unknown): string {
    if (error instanceof ApiClientError) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error occurred";
}

/**
 * Check if the error is a validation error (400)
 */
export function isValidationError(error: unknown): boolean {
    return error instanceof ApiClientError && error.statusCode === 400;
}

/**
 * Check if the error is an unauthorized error (401)
 */
export function isUnauthorizedError(error: unknown): boolean {
    return error instanceof ApiClientError && error.statusCode === 401;
}

/**
 * Check if the error is a not-found error (404)
 */
export function isNotFoundError(error: unknown): boolean {
    return error instanceof ApiClientError && error.statusCode === 404;
}

/**
 * Check if the error is a rate-limit error (429)
 */
export function isRateLimitError(error: unknown): boolean {
    return error instanceof ApiClientError && error.statusCode === 429;
}

/**
 * Get validation error details (for 400 responses with multiple messages)
 */
export function getValidationErrors(error: unknown): string[] {
    if (error instanceof ApiClientError && error.details) {
        return error.details;
    }
    return [];
}
