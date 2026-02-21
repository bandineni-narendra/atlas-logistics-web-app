"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { KeyboardArrowDown } from "@mui/icons-material";
import { FilterChip, DateRangePicker } from "@/components/ui";
import { useFileFilters } from "@/hooks/useFileFilters";

export function DateRangeFilter() {
    const t = useTranslations("filters");
    const { filters, setFilter } = useFileFilters();
    const [isOpen, setIsOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative">
            <div ref={anchorRef}>
                <FilterChip
                    label={filters.startDate ? `${filters.startDate} - ${filters.endDate}` : t("date")}
                    isActive={!!filters.startDate}
                    trailingIcon={<KeyboardArrowDown fontSize="small" />}
                    onClick={() => setIsOpen((prev) => !prev)}
                />
            </div>

            <DateRangePicker
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                anchorRef={anchorRef as any}
                range={{ startDate: filters.startDate, endDate: filters.endDate }}
                onChange={(range) => setFilter(range)}
            />
        </div>
    );
}
