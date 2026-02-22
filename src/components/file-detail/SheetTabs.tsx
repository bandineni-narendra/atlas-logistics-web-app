"use client";


export interface SheetTabsProps {
    sheets: { id: string; name: string }[];
    activeSheetId: string;
    onTabChange: (sheetId: string) => void;
}

/**
 * Sheet Tabs — M3 tab bar with 3px primary indicator
 */
export function SheetTabs({
    sheets,
    activeSheetId,
    onTabChange,
}: SheetTabsProps) {
    if (sheets.length === 0) return null;

    return (
        <div className="flex gap-1 border-b border-border bg-surface px-1 overflow-x-auto scrollbar-none">
            {sheets.map((sheet) => {
                const isActive = sheet.id === activeSheetId;
                return (
                    <button
                        key={sheet.id}
                        onClick={() => onTabChange(sheet.id)}
                        className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 -mb-px relative group ${isActive
                            ? "border-primary text-primary bg-[var(--pure-surface)]"
                            : "border-transparent text-textSecondary hover:text-textPrimary hover:bg-surface"
                            }`}
                    >
                        {sheet.name}
                        {isActive && (
                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-t-full shadow-[0_0_8px_var(--primary)]" />
                        )}
                        {!isActive && (
                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-transparent group-hover:bg-border transition-all" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
