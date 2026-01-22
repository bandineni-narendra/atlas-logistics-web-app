"use client";

import { formatSheetName } from "@/utils";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

import { OceanTable, ErrorBox, ProgressLabel } from "@/components";
import { OceanFreightResult } from "@/types/ocean";
import ExcelUploadFlow from "@/app/excel-flow/ExcelUploadFlow";
import {
  PageContainer,
  PageHeader,
  Card,
  CardContent,
  Alert,
  ProgressBar,
} from "@/components/ui";

type SheetResult = {
  sheetName: string;
  result: OceanFreightResult;
};

export default function OceanPage() {
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
    (sheetName: string, result: OceanFreightResult) => {
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

  return (
    <PageContainer>
      <PageHeader
        title="Excel Flow Processing"
        description="Process multi-sheet Excel files with sequential job handling"
      />

      {/* Upload Section */}
      <Card>
        <CardContent>
          <ExcelUploadFlow
            onTotalSheetsDetected={handleTotalSheetsDetected}
            onSheetCompleted={handleSheetCompleted}
            onUploadError={handleUploadError}
          />
        </CardContent>
      </Card>

      {error && (
        <Alert variant="error" title="Processing Error">
          {error}
        </Alert>
      )}

      {totalSheets > 0 && (
        <Card padding="sm">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Processing sheets...</span>
              <span className="font-medium text-gray-900">
                {completedCount} / {totalSheets} completed
              </span>
            </div>
            <ProgressBar value={completedCount} max={totalSheets} showLabel />
          </CardContent>
        </Card>
      )}

      {/* Tab UI for sheets */}
      {results.length > 0 && (
        <Card padding="none">
          <div className="border-b border-gray-200 bg-gray-50 px-4">
            <div className="flex gap-1 overflow-x-auto">
              {results.map(({ sheetName }, idx) => (
                <button
                  key={sheetName}
                  className={`px-4 py-3 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px whitespace-nowrap ${
                    activeTab === idx
                      ? "border-blue-600 text-blue-700 bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(idx)}
                  type="button"
                >
                  {formatSheetName(sheetName, `Sheet ${idx + 1}`)}
                </button>
              ))}
            </div>
          </div>
          <CardContent className="p-0">
            <OceanTable
              data={results[activeTab].result.data}
              isLoading={false}
              currentPage={tabPages[activeTab] || 1}
              onPageChange={(page: number) =>
                handleTabPageChange(activeTab, page)
              }
            />
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
