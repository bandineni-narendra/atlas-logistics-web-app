"use client";

import { formatSheetName } from "@/utils";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

import { AirTable } from "@/components/air";
import { AirFreightResult, AirFreightRow } from "@/types/air";
import AirUploadFlow from "@/components/air/AirUploadFlow";
import {
  Card,
  CardContent,
  Alert,
} from "@/components/ui";

type SheetResult = {
  sheetName: string;
  result: AirFreightResult;
};

/**
 * Air Freight page
 * Shows Excel upload and displays processed results with multi-sheet support
 */
export default function AirPage() {
  const t = useTranslations();
  const [results, setResults] = useState<SheetResult[]>([]);
  const [totalSheets, setTotalSheets] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  // Store current page for each tab
  const [tabPages, setTabPages] = useState<number[]>([]);

  const completedCount = Array.isArray(results) ? results.length : 0;

  const handleTotalSheetsDetected = useCallback((count: number) => {
    setTotalSheets(count);
    setResults([]);
    setError(null);
    setActiveTab(0);
    setTabPages(Array(count).fill(1)); // Reset all tab pages to 1
  }, []);

  const handleSheetCompleted = useCallback(
    (sheetName: string, result: AirFreightResult) => {
      setResults((prev) => {
        const next = [...prev, { sheetName, result }];
        return next;
      });
      setTabPages((prevPages) => [...prevPages, 1]);
    },
    [],
  );

  const handleUploadError = useCallback((msg: string) => {
    setError(msg);
  }, []);

  // Handler for changing page in a tab
  const handleTabPageChange = useCallback((tabIdx: number, page: number) => {
    setTabPages((prev) => {
      const updated = [...prev];
      updated[tabIdx] = page;
      return updated;
    });
  }, []);

  // Handler for cell edits
  const handleCellChange = useCallback(
    (rowIndex: number, key: keyof AirFreightRow, value: string) => {
      setResults((prev) => {
        const updated = [...prev];
        const sheetData = [...updated[activeTab].result.data];
        sheetData[rowIndex] = {
          ...sheetData[rowIndex],
          [key]: value,
        };
        updated[activeTab] = {
          ...updated[activeTab],
          result: {
            ...updated[activeTab].result,
            data: sheetData,
          },
        };
        return updated;
      });
    },
    [activeTab],
  );

  return (
    <main className="px-6 py-5 max-w-7xl mx-auto flex flex-col w-full h-full">
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-[var(--on-surface)] tracking-tight">
            {t("air.pageTitle")}
          </h1>
          <p className="mt-0.5 text-sm text-[var(--on-surface-variant)]">{t("air.uploadDescription")}</p>
        </div>

        {/* Compact progress indicator */}
        {totalSheets > 0 && completedCount < totalSheets && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 shrink-0">
            <svg
              className="w-4 h-4 text-blue-600 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm font-medium text-blue-700">
              {t("progress.countOfTotal", { count: completedCount, total: totalSheets })}
            </span>
          </div>
        )}
      </header>

      {/* Upload Section */}
      <Card>
        <CardContent>
          <AirUploadFlow
            onTotalSheetsDetected={handleTotalSheetsDetected}
            onSheetCompleted={handleSheetCompleted}
            onUploadError={handleUploadError}
          />
        </CardContent>
      </Card>

      {error && (
        <Alert variant="error" title={t("air.processingError")}>
          {error}
        </Alert>
      )}

      {/* Tab UI for sheets */}
      {results.length > 0 && (
        <Card padding="none">
          <div className="border-b border-gray-200 bg-gray-50 px-4">
            <div className="flex gap-1 overflow-x-auto">
              {results.map(({ sheetName }, idx) => (
                <button
                  key={sheetName}
                  className={`px-4 py-3 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px whitespace-nowrap ${activeTab === idx
                    ? "border-blue-600 text-blue-700 bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => setActiveTab(idx)}
                  type="button"
                >
                  {formatSheetName(sheetName, t("air.sheetFallback", { index: idx + 1 }))}
                </button>
              ))}
            </div>
          </div>
          <CardContent className="p-0">
            <AirTable
              data={results[activeTab].result.data}
              isLoading={false}
              currentPage={tabPages[activeTab] || 1}
              onPageChange={(page: number) =>
                handleTabPageChange(activeTab, page)
              }
              onCellChange={handleCellChange}
            />
          </CardContent>
        </Card>
      )}
    </main>
  );
}
