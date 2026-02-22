"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { KeyboardArrowDown } from "@mui/icons-material";
import { FilterChip, Popover } from "@/components/ui";
import { useFileFilters, FileStatus } from "@/hooks/useFileFilters";

export function StatusFilter() {
    const t = useTranslations("filters");
    const { filters, setFilter } = useFileFilters();
    const [isOpen, setIsOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const statuses: FileStatus[] = ["all", "saved", "draft", "archived"];

    return (
        <div className="relative">
            <div ref={anchorRef}>
                <FilterChip
                    label={filters.status === "all" ? t("status") : `${t("status")}: ${t(filters.status as any)}`}
                    isActive={filters.status !== "all"}
                    trailingIcon={<KeyboardArrowDown fontSize="small" />}
                    onClick={() => setIsOpen((prev) => !prev)}
                />
            </div>

            <Popover
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                anchorRef={anchorRef as unknown as React.RefObject<HTMLElement>}
                className="w-40 bg-surface rounded-lg shadow-lg border border-border py-1"
            >
                {statuses.map((status) => (
                    <button
                        key={status}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-surface ${filters.status === status ? "text-primary font-medium" : "text-textPrimary"
                            }`}
                        onClick={() => {
                            setFilter({ status });
                            setIsOpen(false);
                        }}
                    >
                        {status === "all" ? t("anyStatus") : t(status as any)}
                    </button>
                ))}
            </Popover>
        </div>
    );
}
