"use client";

import { formatSheetName } from "@/utils";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { OceanTable, ErrorBox, ProgressLabel } from "@/components";
import { OceanFreightResult, OceanFreightRow } from "@/types/ocean";
import ExcelUploadFlow from "@/app/excel-flow/ExcelUploadFlow";
import {
  Card,
  CardContent,
  Alert,
  ProgressBar,
  Button
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

  // Handler for cell edits
  const handleCellChange = useCallback(
    (rowIndex: number, key: keyof OceanFreightRow, value: string) => {
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
          <h1 className="text-xl font-medium text-textPrimary tracking-tight">
            {t("excelFlow.title")}
          </h1>
          <p className="mt-0.5 text-sm text-textSecondary">
            {t("excelFlow.description")}
          </p>
        </div>

        {/* Compact progress indicator */}
        {totalSheets > 0 && completedCount < totalSheets && (
          <div className="flex items-center gap-2 px-3 py-2 bg-primary-soft rounded-lg border border-transparent shrink-0">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-sm font-medium text-primary">
              {t("progress.countOfTotal", { count: completedCount, total: totalSheets })}
            </span>
          </div>
        )}
      </header>

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
        <Alert variant="error" title={t("excelFlow.processingError")}>
          {error}
        </Alert>
      )}

      {/* Tab UI for sheets */}
      {results.length > 0 && (
        <Card padding="none">
          <div className="border-b border-border bg-surface px-4">
            <div className="flex gap-1 overflow-x-auto">
              {results.map(({ sheetName }, idx) => (
                <Button
                  key={sheetName}
                  variant="ghost"
                  className={`px-4 py-3 rounded-none text-sm font-medium transition-colors duration-150 border-b-2 -mb-px whitespace-nowrap ${activeTab === idx
                    ? "border-primary text-primary bg-surface"
                    : "border-transparent text-textSecondary hover:text-textPrimary hover:bg-surface"
                    }`}
                  onClick={() => setActiveTab(idx)}
                >
                  {formatSheetName(sheetName, t("air.sheetFallback", { index: idx + 1 }))}
                </Button>
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
              onCellChange={handleCellChange}
            />
          </CardContent>
        </Card>
      )}
    </main>
  );
}
