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
 * Date Range Filter Component
 * Two native date inputs (From / To) for filtering files by effectiveDate.
 * Dates are in YYYY-MM-DD format to match the backend @IsDateString().
 */
export const DateRangeFilter = memo<DateRangeFilterProps>(
    function DateRangeFilter({ startDate, endDate, onDateChange }) {
        return (
            <div className="flex flex-wrap items-center gap-3">
                {/* From */}
                <div className="flex items-center gap-2">
                    <label
                        htmlFor="filter-start-date"
                        className="text-sm font-medium text-gray-600"
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
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* To */}
                <div className="flex items-center gap-2">
                    <label
                        htmlFor="filter-end-date"
                        className="text-sm font-medium text-gray-600"
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
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>
        );
    }
);
