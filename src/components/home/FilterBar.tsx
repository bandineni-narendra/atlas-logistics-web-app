"use client";

import React from "react";
import { useFileFilters } from "@/hooks/useFileFilters";
import { Close, FilterList } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { TypeFilter, StatusFilter, DateRangeFilter } from "./filters";

/**
 * Filter Bar - Gmail style
 * Displays actionable chips for filtering data
 */
export function FilterBar() {
    const t = useTranslations("filters");
    const { hasActiveFilters, clearFilters } = useFileFilters();

    return (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">

            {/* Icon only label */}
            <div className="text-textSecondary mr-1">
                <FilterList fontSize="small" />
            </div>

            {/* --- Filter: Type (Air / Ocean) --- */}
            <TypeFilter />

            <div className="w-[1px] h-6 bg-border mx-1" />

            {/* --- Filter: Status (Dropdown) --- */}
            <StatusFilter />

            {/* --- Filter: Date Range --- */}
            <DateRangeFilter />

            {/* --- Clear All --- */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="ml-2 p-1 rounded-full hover:bg-surface text-textSecondary transition-colors"
                    title={t("clear")}
                >
                    <Close fontSize="small" />
                </button>
            )}
        </div>
    );
}
