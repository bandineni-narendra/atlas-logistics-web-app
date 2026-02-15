/**
 * React Query Provider
 *
 * Sets up QueryClient with sensible defaults for the app.
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ThemeProviderWrapper } from "@/contexts/ThemeContext";
import ThemeRegistry from "@/theme/ThemeRegistry";

function makeQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000, // 30 seconds
                retry: 1,
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: 0,
            },
        },
    });
}

// Singleton for browser — avoids re-creating on every render
let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
    if (typeof window === "undefined") {
        // Server: always make a new query client
        return makeQueryClient();
    }
    // Browser: reuse singleton
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(getQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeRegistry>
                <ThemeProviderWrapper>
                    {children}
                </ThemeProviderWrapper>
            </ThemeRegistry>
        </QueryClientProvider>
    );
}
