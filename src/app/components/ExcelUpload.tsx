"use client";

import { useExcelJob } from "hooks/excel/useExcelJob";
import { useState } from "react";
import { RawExcelSheet } from "types/excel/excel";
import * as XLSX from "xlsx";
import { FileSelectButton } from "./FileSelectButton";

export default function ExcelUpload() {
  const { submit, job, loading } = useExcelJob();
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const isRowEmpty = (row: unknown[]) =>
    row.every(
      (cell) =>
        cell === null ||
        cell === undefined ||
        (typeof cell === "string" && cell.trim() === ""),
    );

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
      setParseError("Failed to read Excel file");
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

      {/* Job Status */}
      {loading && (
        <p className="text-sm text-gray-600">🧠 AI is analyzing your Excel…</p>
      )}

      {job?.status === "PENDING" && (
        <p className="text-sm text-gray-600">⏳ Job queued</p>
      )}

      {job?.status === "RUNNING" && (
        <p className="text-sm text-gray-600">
          ⚙️ Processing (LLM is thinking and structuring your Excel data)
        </p>
      )}

      {job?.status === "FAILED" && (
        <p className="text-sm text-red-600">❌ Failed: {job.error}</p>
      )}

      {/* Result */}
      {job?.status === "COMPLETED" && (
        <div>
          <h3 className="text-sm font-semibold mb-2">✅ Structured Output</h3>
          <pre className="bg-black text-green-400 p-4 rounded-md overflow-auto max-h-96 text-xs">
            {JSON.stringify(job.result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
