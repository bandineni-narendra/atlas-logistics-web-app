"use client";

import React, { useState, useRef } from "react";
import { FilterChip, DateRangePicker, Popover } from "@/components/ui";
import { useFileFilters } from "@/hooks/useFileFilters";
import { KeyboardArrowDown, Close, FilterList } from "@mui/icons-material";

/**
 * Filter Bar - Gmail style
 * Displays actionable chips for filtering data
 */
export function FilterBar() {
    const { filters, setFilter, clearFilters, hasActiveFilters } = useFileFilters();

    // Local state for popovers
    const [activePopover, setActivePopover] = useState<"none" | "status" | "date">("none");
    const dateButtonRef = useRef<HTMLButtonElement>(null);
    const statusButtonRef = useRef<HTMLButtonElement>(null);

    // Helper to toggle 'Type' (cycle through options or simple toggle)
    // For simplicity: Type is a toggle between All -> Air -> Ocean -> All (or separate chips)
    // Gmail style: usually separate dropdowns. We'll use specific chips for common actions.

    return (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">

            {/* Icon only label */}
            <div className="text-[var(--on-surface-variant)] mr-1">
                <FilterList fontSize="small" />
            </div>

            {/* --- Filter: Type (Air / Ocean) --- */}
            {/* Simple toggle chips for quick access */}
            <FilterChip
                label="Air Freight"
                isActive={filters.type === "AIR"}
                onClick={() => setFilter({ type: filters.type === "AIR" ? "all" : "AIR" })}
            />
            <FilterChip
                label="Ocean Freight"
                isActive={filters.type === "OCEAN"}
                onClick={() => setFilter({ type: filters.type === "OCEAN" ? "all" : "OCEAN" })}
            />

            <div className="w-[1px] h-6 bg-[var(--outline-variant)] mx-1" />

            {/* --- Filter: Status (Dropdown) --- */}
            <div className="relative">
                <div ref={statusButtonRef}>
                    <FilterChip
                        label={filters.status === "all" ? "Status" : `Status: ${filters.status}`}
                        isActive={filters.status !== "all"}
                        trailingIcon={<KeyboardArrowDown fontSize="small" />}
                        onClick={() => setActivePopover(activePopover === "status" ? "none" : "status")}
                    />
                </div>

                {/* Status Dropdown Menu */}
                <Popover
                    isOpen={activePopover === "status"}
                    onClose={() => setActivePopover("none")}
                    anchorRef={statusButtonRef as React.RefObject<HTMLElement>}
                    className="w-40 bg-[var(--surface-container)] rounded-lg shadow-lg border border-[var(--outline-variant)] py-1"
                >
                    {["all", "saved", "draft", "archived"].map((status) => (
                        <button
                            key={status}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--surface-container-high)] ${filters.status === status ? "text-[var(--primary)] font-medium" : "text-[var(--on-surface)]"
                                }`}
                            onClick={() => {
                                setFilter({ status: status as any });
                                setActivePopover("none");
                            }}
                        >
                            {status === "all" ? "Any Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </Popover>
            </div>

            {/* --- Filter: Date Range --- */}
            <div className="relative">
                <div ref={dateButtonRef}>
                    <FilterChip
                        label={filters.startDate ? `${filters.startDate} - ${filters.endDate}` : "Date"}
                        isActive={!!filters.startDate}
                        trailingIcon={<KeyboardArrowDown fontSize="small" />}
                        onClick={() => setActivePopover(activePopover === "date" ? "none" : "date")}
                    />
                </div>

                <DateRangePicker
                    isOpen={activePopover === "date"}
                    onClose={() => setActivePopover("none")}
                    anchorRef={dateButtonRef as any}
                    range={{ startDate: filters.startDate, endDate: filters.endDate }}
                    onChange={(range) => {
                        setFilter(range);
                        // Don't close immediately to allow selecting end date
                    }}
                />
            </div>

            {/* --- Clear All --- */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="ml-auto text-xs font-medium text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                    <Close fontSize="small" style={{ fontSize: 14 }} />
                    Clear filters
                </button>
            )}
        </div>
    );
}
