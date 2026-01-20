"use client";

import { useMultiSheetExcelJob } from "@/hooks/excel/useMultiSheetExcelJob";
import { useState, useEffect } from "react";
import { RawExcelSheet, MultiSheetResult } from "@/types/excel/excel";
import * as XLSX from "xlsx";
import { FileSelectButton } from "./FileSelectButton";

export type MultiSheetExcelUploadProps = {
  onUploadSuccess?: (data: MultiSheetResult) => void;
  onUploadError?: (error: string) => void;
};

export default function MultiSheetExcelUpload({
  onUploadSuccess,
  onUploadError,
}: MultiSheetExcelUploadProps) {
  const { submit, job, loading, error } = useMultiSheetExcelJob();
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const isRowEmpty = (row: unknown[]) =>
    row.every(
      (cell) =>
        cell === null ||
        cell === undefined ||
        (typeof cell === "string" && cell.trim() === ""),
    );

  // Listen for job completion and notify parent
  useEffect(() => {
    if (job?.fileName && onUploadSuccess) {
      onUploadSuccess(job);
    }
  }, [job?.fileName]);

  useEffect(() => {
    if (error && onUploadError) {
      setParseError(error);
      onUploadError(error);
    }
  }, [error]);

  const handleFileUpload = async (file: File) => {
    setParseError(null);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const sheets: RawExcelSheet[] = workbook.SheetNames.map((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: true,
        }) as unknown[][];

        // ✅ Remove fully empty rows
        const cleanedRows = rawRows.filter((row) => !isRowEmpty(row));

        return {
          sheetName,
          rows: cleanedRows,
        };
      });

      await submit({
        fileName: file.name,
        sheets,
      });
    } catch (err) {
      console.error(err);
      const errorMsg = "Failed to read Excel file";
      setParseError(errorMsg);
      if (onUploadError) {
        onUploadError(errorMsg);
      }
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      {/* File Picker Button */}
      <FileSelectButton
        onFileSelect={handleFileUpload}
        disabled={loading}
        label={loading ? "Processing…" : "Select Excel File"}
      />

      {fileName && (
        <p className="text-sm text-gray-700">
          <strong>File:</strong> {fileName}
        </p>
      )}

      {/* Parsing Error */}
      {parseError && <p className="text-sm text-red-600">{parseError}</p>}

      {/* Sheet Processing Results */}
      {job && (
        <div className="space-y-3 rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-800">Processing Results:</h3>
          {job.sheets.map((sheet) => (
            <div
              key={sheet.sheetName}
              className={`rounded p-3 ${
                sheet.status === "COMPLETED"
                  ? "border-l-4 border-green-500 bg-green-50"
                  : "border-l-4 border-red-500 bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  {sheet.sheetName}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    sheet.status === "COMPLETED"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {sheet.status}
                </span>
              </div>
              {sheet.status === "COMPLETED" && sheet.result && (
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Type:</strong> {sheet.result.tableType}
                  </p>
                  <p>
                    <strong>Records:</strong>{" "}
                    {Array.isArray(sheet.result.data)
                      ? sheet.result.data.length
                      : 0}
                  </p>
                  {sheet.result.warnings &&
                    sheet.result.warnings.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-yellow-700">Warnings:</p>
                        <ul className="list-inside list-disc space-y-1 text-yellow-600">
                          {sheet.result.warnings.map(
                            (warning: string, idx: number) => (
                              <li key={idx}>{warning}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              )}
              {sheet.status === "FAILED" && sheet.error && (
                <p className="mt-2 text-sm text-red-700">{sheet.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
