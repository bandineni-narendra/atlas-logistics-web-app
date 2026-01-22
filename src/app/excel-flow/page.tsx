"use client";
// Helper to format sheet names: first letter capital, rest lower case
function formatSheetName(name: string, fallback: string): string {
  if (typeof name === "string" && name.length > 0) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  return fallback;
}

import { useState } from "react";

import { OceanTable } from "@/components/ocean/OceanTable";
import { OceanFreightResult } from "@/types/ocean";
import ExcelUploadFlow from "./ExcelUploadFlow";

type SheetResult = {
  sheetName: string;
  result: OceanFreightResult;
};

export default function OceanPage() {
  const [results, setResults] = useState<SheetResult[]>([]);
  const [totalSheets, setTotalSheets] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  // Store current page for each tab
  const [tabPages, setTabPages] = useState<number[]>([]);

  const completedCount = Array.isArray(results) ? results.length : 0;

  const handleTotalSheetsDetected = (count: number) => {
    setTotalSheets(count);
    setResults([]);
    setError(null);
    setActiveTab(0);
    setTabPages(Array(count).fill(1)); // Reset all tab pages to 1
  };

  const handleSheetCompleted = (
    sheetName: string,
    result: OceanFreightResult,
  ) => {
    setResults((prev) => {
      const next = [...prev, { sheetName, result }];
      // Ensure tabPages array matches results length
      if (next.length > tabPages.length) {
        setTabPages((prevPages) => [...prevPages, 1]);
      }
      return next;
    });
  };

  const handleUploadError = (msg: string) => {
    setError(msg);
  };

  // Handler for changing page in a tab
  const handleTabPageChange = (tabIdx: number, page: number) => {
    setTabPages((prev) => {
      const updated = [...prev];
      updated[tabIdx] = page;
      return updated;
    });
  };

  return (
    <div className="px-8 py-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Ocean Freight Rates</h1>

      {/* ✅ Render ONCE */}
      <ExcelUploadFlow
        onTotalSheetsDetected={handleTotalSheetsDetected}
        onSheetCompleted={handleSheetCompleted}
        onUploadError={handleUploadError}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {totalSheets > 0 && (
        <p className="text-sm text-gray-600">
          Processed {completedCount} of {totalSheets} sheets
        </p>
      )}

      {/* Tab UI for sheets */}
      {results.length > 0 && (
        <div className="mt-6">
          <div className="flex border-b border-gray-200 mb-4">
            {results.map(({ sheetName }, idx) => (
              <button
                key={sheetName}
                className={`px-4 py-2 -mb-px border-b-2 font-medium focus:outline-none transition-colors duration-150 ${
                  activeTab === idx
                    ? "border-blue-600 text-blue-700 bg-white"
                    : "border-transparent text-gray-500 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab(idx)}
                type="button"
              >
                {formatSheetName(sheetName, `Sheet ${idx + 1}`)}
              </button>
            ))}
          </div>
          {/* Tab content: show only active sheet */}
          <div className="border rounded-lg overflow-hidden">
            <OceanTable
              data={results[activeTab].result.data}
              isLoading={false}
              currentPage={tabPages[activeTab] || 1}
              onPageChange={(page: number) =>
                handleTabPageChange(activeTab, page)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
