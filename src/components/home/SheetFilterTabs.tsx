"use client";

/**
 * Sheet Filter Tabs — M3 chip/segmented buttons
 */

export interface SheetFilterTabsProps {
  activeTab: "all" | "ocean" | "air";
  onTabChange: (tab: "all" | "ocean" | "air") => void;
}

export function SheetFilterTabs({
  activeTab,
  onTabChange,
}: SheetFilterTabsProps) {
  const tabs = [
    { value: "all" as const, label: "All" },
    { value: "ocean" as const, label: "Ocean" },
    { value: "air" as const, label: "Air" },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-100 ease-out ${activeTab === tab.value
              ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
              : "border border-[var(--outline)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] bg-transparent"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
