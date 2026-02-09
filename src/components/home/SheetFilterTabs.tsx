"use client";

/**
 * Sheet Filter Tabs Component
 * Allows filtering sheets by type
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
    { value: "all" as const, label: "All Sheets" },
    { value: "ocean" as const, label: "Ocean (🚢)" },
    { value: "air" as const, label: "Air (✈️)" },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === tab.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
