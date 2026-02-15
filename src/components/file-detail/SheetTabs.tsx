"use client";

import { memo } from "react";

export interface SheetTabsProps {
    sheets: { id: string; name: string }[];
    activeSheetId: string;
    onTabChange: (sheetId: string) => void;
}

/**
 * Sheet Tabs Component
 * Horizontal tab bar — one tab per sheet.
 */
export const SheetTabs = memo<SheetTabsProps>(function SheetTabs({
    sheets,
    activeSheetId,
    onTabChange,
}) {
    if (sheets.length === 0) return null;

    return (
        <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
            {sheets.map((sheet) => {
                const isActive = sheet.id === activeSheetId;
                return (
                    <button
                        key={sheet.id}
                        onClick={() => onTabChange(sheet.id)}
                        className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${isActive
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        {sheet.name}
                    </button>
                );
            })}
        </div>
    );
});
