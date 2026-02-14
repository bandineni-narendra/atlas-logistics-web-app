/**
 * React Query Auth Hooks
 *
 * Query and mutation hooks for authentication operations.
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import type { UpdateProfileRequest, User } from "@/types/api";

/**
 * Fetch current user profile
 */
export function useCurrentUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => authService.getCurrentUser(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    });
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
        onSuccess: (updatedUser: User) => {
            queryClient.setQueryData(["user"], updatedUser);
        },
    });
}

/**
 * Delete user account
 */
export function useDeleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authService.deleteAccount(),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["user"] });
        },
    });
}
