"use client";

import Link from "next/link";
import { SheetsView } from "@/components/sheets";
import { SheetFilterTabs } from "./SheetFilterTabs";

/**
 * Sheets Section Component
 * Displays sheet listing with filtering capabilities
 */

export interface SheetsSectionProps {
  activeTab: "all" | "ocean" | "air";
  onTabChange: (tab: "all" | "ocean" | "air") => void;
}

export function SheetsSection({ activeTab, onTabChange }: SheetsSectionProps) {
  return (
    <div className="mt-8">
      {/* Header with View All Link */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Your Sheets</h2>
        <Link
          href="/ocean"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All →
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4">
        <SheetFilterTabs activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {/* Sheets Grid */}
      <SheetsView filter={activeTab} />
    </div>
  );
}
