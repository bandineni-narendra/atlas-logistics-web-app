"use client";

import { useState } from "react";

import { OceanHeader } from "@/components/ocean/OceanHeader";
import { OceanWarnings } from "@/components/ocean/OceanWarnings";
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

  const completedCount = Array.isArray(results) ? results.length : 0;

  const handleTotalSheetsDetected = (count: number) => {
    setTotalSheets(count);
    setResults([]);
    setError(null);
  };

  const handleSheetCompleted = (
    sheetName: string,
    result: OceanFreightResult,
  ) => {
    setResults((prev) => [...prev, { sheetName, result }]);
  };

  const handleUploadError = (msg: string) => {
    setError(msg);
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

      {results.map(({ sheetName, result }) => (
        <div key={sheetName} className="border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold">Sheet: {sheetName}</h2>
          </div>

          <OceanHeader confidence={result.confidence} />
          <OceanWarnings warnings={result.warnings} />
          <OceanTable data={result.data} isLoading={false} />
        </div>
      ))}
    </div>
  );
}
