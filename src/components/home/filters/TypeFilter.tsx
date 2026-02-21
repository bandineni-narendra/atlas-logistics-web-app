"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FilterChip } from "@/components/ui";
import { useFileFilters } from "@/hooks/useFileFilters";

export function TypeFilter() {
    const t = useTranslations("filters");
    const { filters, setFilter } = useFileFilters();

    return (
        <>
            <FilterChip
                label={t("airFreight")}
                isActive={filters.type === "AIR"}
                onClick={() => setFilter({ type: filters.type === "AIR" ? "all" : "AIR" })}
            />
            <FilterChip
                label={t("oceanFreight")}
                isActive={filters.type === "OCEAN"}
                onClick={() => setFilter({ type: filters.type === "OCEAN" ? "all" : "OCEAN" })}
            />
        </>
    );
}
