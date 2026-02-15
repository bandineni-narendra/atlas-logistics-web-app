"use client";

import { memo } from "react";

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface DateRangeFilterProps {
    startDate: string;
    endDate: string;
    onDateChange: (range: DateRange) => void;
}

/**
 * Date Range Filter — M3 outlined date inputs
 */
export const DateRangeFilter = memo<DateRangeFilterProps>(
    function DateRangeFilter({ startDate, endDate, onDateChange }) {
        return (
            <div className="flex flex-wrap items-center gap-3">
                {/* From */}
                <div className="flex items-center gap-2">
                    <label
                        htmlFor="filter-start-date"
                        className="text-sm font-medium text-[var(--on-surface-variant)]"
                    >
                        From
                    </label>
                    <input
                        id="filter-start-date"
                        type="date"
                        value={startDate}
                        max={endDate}
                        onChange={(e) =>
                            onDateChange({ startDate: e.target.value, endDate })
                        }
                        className="px-3 py-1.5 text-sm border border-[var(--outline)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-30 focus:border-[var(--primary)] transition-all duration-100"
                    />
                </div>

                {/* To */}
                <div className="flex items-center gap-2">
                    <label
                        htmlFor="filter-end-date"
                        className="text-sm font-medium text-[var(--on-surface-variant)]"
                    >
                        To
                    </label>
                    <input
                        id="filter-end-date"
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) =>
                            onDateChange({ startDate, endDate: e.target.value })
                        }
                        className="px-3 py-1.5 text-sm border border-[var(--outline)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-30 focus:border-[var(--primary)] transition-all duration-100"
                    />
                </div>
            </div>
        );
    }
);
