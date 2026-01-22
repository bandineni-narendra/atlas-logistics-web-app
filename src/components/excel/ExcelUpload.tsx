"use client";

import { useExcelJob } from "@/hooks/excel/useExcelJob";
import { useState, useEffect } from "react";
import { RawExcelSheet } from "@/types/excel/excel";
import { OceanFreightResult } from "@/types/ocean";
import * as XLSX from "xlsx";
import { FileSelectButton } from "@/components/excel/FileSelectButton";
import { ErrorText, FileLabel } from "@/components/feedback";
import { JobStatus } from "@/components/job";
import { isRowEmpty } from "@/utils";

export type ExcelUploadProps = {
  onUploadSuccess?: (data: OceanFreightResult) => void;
  onUploadError?: (error: string) => void;
};

export default function ExcelUpload({
  onUploadSuccess,
  onUploadError,
}: ExcelUploadProps) {
  const { submit, job, loading } = useExcelJob();
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Listen for job completion and notify parent
  useEffect(() => {
    if (job?.status === "COMPLETED" && job.result) {
      if (onUploadSuccess) {
        onUploadSuccess(job.result as OceanFreightResult);
      }
    } else if (job?.status === "FAILED") {
      const errorMsg = job.error || "Failed to process Excel file";
      setParseError(errorMsg);
      if (onUploadError) {
        onUploadError(errorMsg);
      }
    }
  }, [job?.status, job?.result, job?.error, onUploadSuccess, onUploadError]);

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

      {fileName && <FileLabel fileName={fileName} />}

      {/* Parsing Error */}
      {parseError && <ErrorText message={parseError} />}

      {/* Job Status */}
      {loading && <JobStatus status="LOADING" variant="block" />}
      {job?.status === "PENDING" && (
        <JobStatus status="PENDING" variant="block" />
      )}
      {job?.status === "RUNNING" && (
        <JobStatus status="RUNNING" variant="block" />
      )}
      {job?.status === "FAILED" && (
        <ErrorText message={`❌ Failed: ${job.error}`} />
      )}

      {/* Result Debug (optional, can be removed) */}
      {job?.status === "COMPLETED" && (
        <div>
          <h3 className="text-sm font-semibold mb-2">✅ Processing Complete</h3>
          <p className="text-xs text-gray-600">Data is now displayed above</p>
        </div>
      )}
    </div>
  );
}
