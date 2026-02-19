"use client";

import Link from "next/link";
import { SheetsView } from "@/components/sheets";
import { FilterBar } from "./FilterBar";
import { useFileFilters } from "@/hooks/useFileFilters";

/**
 * Sheets Section — M3 styled with URL-persisted filters
 */

export function SheetsSection() {
  const { filters, setFilter } = useFileFilters();

  const handlePageChange = (newPage: number) => {
    setFilter({ page: newPage });
  };

  // Convert "all" type to undefined for SheetsView if needed, 
  // or ensure SheetsView handles "all".
  // Assuming SheetsView expects "all" | "ocean" | "air" based on previous interface.
  const activeTab = filters.type === "AIR" ? "air" : filters.type === "OCEAN" ? "ocean" : "all";

  return (
    <div className="mt-6">
      {/* Header with View All Link */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-[var(--on-surface-variant)] uppercase tracking-wide">Your Files</h2>
        <Link
          href="/files"
          className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium"
        >
          {/* View All → */}
        </Link>
      </div>

      {/* Gmail-style Filter Bar */}
      <FilterBar />

      {/* Sheets List (paginated + date-filtered) */}
      <SheetsView
        filter={activeTab}
        page={filters.page}
        onPageChange={handlePageChange}
        startDate={filters.startDate}
        endDate={filters.endDate}
      />
    </div>
  );
}
