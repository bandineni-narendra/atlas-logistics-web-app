import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export type FileType = "all" | "OCEAN" | "AIR";
export type FileStatus = "all" | "saved" | "draft" | "archived";

export interface FilterState {
    type: FileType;
    status: FileStatus;
    startDate: string; // ISO Date YYYY-MM-DD
    endDate: string;   // ISO Date YYYY-MM-DD
    page: number;
}

export function useFileFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 1. Read state from URL
    const filters: FilterState = useMemo(() => {
        const typeParam = searchParams.get("type");
        const statusParam = searchParams.get("status");

        return {
            type: (typeParam as FileType) || "all",
            status: (statusParam as FileStatus) || "all",
            startDate: searchParams.get("startDate") || "",
            endDate: searchParams.get("endDate") || "",
            page: Number(searchParams.get("page")) || 1,
        };
    }, [searchParams]);

    // 2. Setters with automatic URL update
    const setFilter = useCallback(
        (updates: Partial<FilterState>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value === "all" || value === "" || value === null) {
                    params.delete(key);
                } else {
                    params.set(key, String(value));
                }
            });

            // Always reset to page 1 on filter change (unless page is specifically updated)
            if (!updates.page) {
                params.set("page", "1");
            }

            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [router, pathname, searchParams]
    );

    const clearFilters = useCallback(() => {
        router.replace(pathname, { scroll: false });
    }, [router, pathname]);

    // 3. Helper to check if any filter is active
    const hasActiveFilters = useMemo(() => {
        return (
            filters.type !== "all" ||
            filters.status !== "all" ||
            !!filters.startDate ||
            !!filters.endDate
        );
    }, [filters]);

    return {
        filters,
        setFilter,
        clearFilters,
        hasActiveFilters,
    };
}
