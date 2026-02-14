"use client";

import { useExcelJob } from "@/hooks/excel/useExcelJob";
import { useState, useEffect, useCallback } from "react";
import { RawExcelSheet } from "@/types/excel/excel";
import { OceanFreightResult } from "@/types/ocean";
import * as XLSX from "xlsx";
import { FileSelectButton } from "@/components/excel/FileSelectButton";
import { ErrorText, FileLabel } from "@/components/feedback";
import { JobStatus } from "@/components/job";
import { isRowEmpty } from "@/utils";
import { useTranslations } from "next-intl";

export type ExcelUploadProps = {
  onUploadSuccess?: (data: any) => void;
  onUploadError?: (error: string) => void;
  endpoint?: "ocean" | "air";
};

export default function ExcelUpload({
  onUploadSuccess,
  onUploadError,
  endpoint = "ocean",
}: ExcelUploadProps) {
  const t = useTranslations();
  const { submit, job, loading } = useExcelJob(endpoint);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Listen for job completion and notify parent
  useEffect(() => {
    if (job?.status === "completed" && job.result) {
      if (onUploadSuccess) {
        onUploadSuccess(job.result as OceanFreightResult);
      }
    } else if (job?.status === "failed") {
      const errorMsg = job.error || t("errors.failedToProcessExcel");
      setParseError(errorMsg);
      if (onUploadError) {
        onUploadError(errorMsg);
      }
    }
  }, [job?.status, job?.result, job?.error, onUploadSuccess, onUploadError]);

  const handleFileUpload = useCallback(
    async (file: File) => {
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
        const errorMsg = t("errors.failedToReadExcel");
        setParseError(errorMsg);
        if (onUploadError) {
          onUploadError(errorMsg);
        }
      }
    },
    [submit, onUploadError, t],
  );

  return (
    <div className="max-w-3xl space-y-4">
      {/* File Picker Button */}
      <FileSelectButton
        onFileSelect={handleFileUpload}
        disabled={loading}
        label={loading ? t("buttons.processing") : t("buttons.selectExcelFile")}
      />

      {fileName && <FileLabel fileName={fileName} />}

      {/* Parsing Error - shows errors from both parse failures and job.error */}
      {parseError && <ErrorText message={parseError} />}

      {/* Job Status - component handles null/undefined/loading internally */}
      <JobStatus status={loading ? "LOADING" : job?.status} variant="block" />
    </div>
  );
}
