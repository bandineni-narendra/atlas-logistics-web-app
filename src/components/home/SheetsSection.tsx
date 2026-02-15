"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { SheetsView } from "@/components/sheets";
import { SheetFilterTabs } from "./SheetFilterTabs";
import { DateRangeFilter } from "./DateRangeFilter";
import type { DateRange } from "./DateRangeFilter";

/**
 * Sheets Section — M3 styled with URL-persisted filters
 */

export interface SheetsSectionProps {
  activeTab: "all" | "ocean" | "air";
  onTabChange: (tab: "all" | "ocean" | "air") => void;
}

/** Returns today's date as YYYY-MM-DD */
function getTodayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function SheetsSection({ activeTab, onTabChange }: SheetsSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const today = useMemo(() => getTodayISO(), []);

  // Read filter state from URL (fallback to today)
  const startDate = searchParams.get("startDate") || today;
  const endDate = searchParams.get("endDate") || today;
  const page = Number(searchParams.get("page")) || 1;

  /** Helper: update URL search params without full navigation */
  const setParams = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        params.set(k, String(v));
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const handleDateChange = (range: DateRange) => {
    setParams({ startDate: range.startDate, endDate: range.endDate, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage });
  };

  const handleTabChange = (tab: "all" | "ocean" | "air") => {
    onTabChange(tab);
    setParams({ page: 1 });
  };

  return (
    <div className="mt-6">
      {/* Header with View All Link */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-[var(--on-surface-variant)] uppercase tracking-wide">Your Files</h2>
        <Link
          href="/ocean"
          className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium"
        >
          View All →
        </Link>
      </div>

      {/* Filter Tabs + Date Range */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <SheetFilterTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Sheets List (paginated + date-filtered) */}
      <SheetsView
        filter={activeTab}
        page={page}
        onPageChange={handlePageChange}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
