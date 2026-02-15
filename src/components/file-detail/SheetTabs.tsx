"use client";

import { memo } from "react";

export interface SheetTabsProps {
    sheets: { id: string; name: string }[];
    activeSheetId: string;
    onTabChange: (sheetId: string) => void;
}

/**
 * Sheet Tabs — M3 tab bar with 3px primary indicator
 */
export const SheetTabs = memo<SheetTabsProps>(function SheetTabs({
    sheets,
    activeSheetId,
    onTabChange,
}) {
    if (sheets.length === 0) return null;

    return (
        <div className="flex gap-0.5 border-b border-[var(--outline-variant)] overflow-x-auto">
            {sheets.map((sheet) => {
                const isActive = sheet.id === activeSheetId;
                return (
                    <button
                        key={sheet.id}
                        onClick={() => onTabChange(sheet.id)}
                        className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-100 border-b-[3px] -mb-px ${isActive
                            ? "border-[var(--primary)] text-[var(--primary)]"
                            : "border-transparent text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container-low)]"
                            }`}
                    >
                        {sheet.name}
                    </button>
                );
            })}
        </div>
    );
});
