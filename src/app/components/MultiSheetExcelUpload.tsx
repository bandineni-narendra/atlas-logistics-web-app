"use client";


import { useMultiSheetExcelJob } from "@/hooks/excel/useMultiSheetExcelJob";
import { useState, useEffect } from "react";
import { RawExcelSheet, MultiSheetResult } from "@/types/excel/excel";
import * as XLSX from "xlsx";
import { FileSelectButton } from "./FileSelectButton";
import { DataTable } from "@/components/table/DataTable";

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
  const [activeTab, setActiveTab] = useState<number>(0);

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

      {/* Tabbed Sheet Results */}
      {job && job.sheets.length > 0 && (
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Sheets</h3>
          {/* Tab Bar */}
          <div className="flex border-b border-gray-200 mb-4">
            {job.sheets.map((sheet, idx) => (
              <button
                key={sheet.sheetName}
                className={`px-4 py-2 -mb-px border-b-2 font-medium focus:outline-none transition-colors duration-150 ${
                  activeTab === idx
                    ? "border-blue-600 text-blue-700 bg-white"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab(idx)}
                type="button"
                disabled={sheet.status !== "COMPLETED"}
                title={sheet.status !== "COMPLETED" ? "Sheet not ready" : sheet.sheetName}
              >
                {sheet.sheetName}
                {sheet.status !== "COMPLETED" && (
                  <span className="ml-2 text-xs text-red-500">({sheet.status})</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {job.sheets[activeTab] && job.sheets[activeTab].status === "COMPLETED" && job.sheets[activeTab].result && (
            <div className="mt-2">
              <div className="mb-2">
                <span className="font-semibold">Type:</span> {job.sheets[activeTab].result.tableType}
                <span className="ml-4 font-semibold">Records:</span> {Array.isArray(job.sheets[activeTab].result.data) ? job.sheets[activeTab].result.data.length : 0}
              </div>
              {job.sheets[activeTab].result.warnings && job.sheets[activeTab].result.warnings.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium text-yellow-700">Warnings:</span>
                  <ul className="list-inside list-disc space-y-1 text-yellow-600">
                    {job.sheets[activeTab].result.warnings.map((warning: string, idx: number) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* DataTable for the selected sheet */}
              <div className="mt-4">
                <DataTable
                  columns={Object.keys(job.sheets[activeTab].result.data[0] || {}).map((key) => ({
                    key,
                    label: key,
                  }))}
                  data={job.sheets[activeTab].result.data || []}
                  currentPage={1}
                  pageSize={20}
                  totalItems={Array.isArray(job.sheets[activeTab].result.data) ? job.sheets[activeTab].result.data.length : 0}
                  onPageChange={() => {}}
                  isLoading={false}
                />
              </div>
            </div>
          )}
          {job.sheets[activeTab] && job.sheets[activeTab].status === "FAILED" && (
            <div className="mt-2 text-red-700">
              <span className="font-semibold">Error:</span> {job.sheets[activeTab].error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
