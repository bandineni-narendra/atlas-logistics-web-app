"use client";

import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

import { OceanFreightResult } from "@/types/ocean";

import { RawExcelSheet } from "@/types/excel/excel";
import { RawExcelSheetFlowPayload } from "@/types/excel/excel-flow";
import { useExcelJob } from "@/hooks/excel/useExcelFlowJob";
import { FileSelectButton } from "@/components/excel";
import { FileLabel } from "@/components/feedback";
import { JobStatus } from "@/components/job";
import { isRowEmpty, waitForJobCompletion } from "@/utils";

type ExcelUploadFlowProps = {
  onTotalSheetsDetected?: (count: number) => void;
  onSheetCompleted?: (sheetName: string, result: OceanFreightResult) => void;
  onUploadError?: (error: string) => void;
};

type SheetJobState = {
  sheetName: string;
  status: "WAITING" | "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
};

export default function ExcelUploadFlow({
  onTotalSheetsDetected,
  onSheetCompleted,
  onUploadError,
}: ExcelUploadFlowProps) {
  const { submit, getJob } = useExcelJob();

  const [sheetJobs, setSheetJobs] = useState<SheetJobState[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  // ✅ Stable refs for async-safe callbacks
  const totalSheetsRef = useRef(onTotalSheetsDetected);
  const sheetCompletedRef = useRef(onSheetCompleted);
  const uploadErrorRef = useRef(onUploadError);

  useEffect(() => {
    totalSheetsRef.current = onTotalSheetsDetected;
    sheetCompletedRef.current = onSheetCompleted;
    uploadErrorRef.current = onUploadError;
  }, [onTotalSheetsDetected, onSheetCompleted, onUploadError]);

  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    setSheetJobs([]);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      // ✅ HARD SAFETY CHECK
      if (
        !workbook ||
        !Array.isArray(workbook.SheetNames) ||
        workbook.SheetNames.length === 0
      ) {
        throw new Error("Invalid or empty Excel file");
      }

      const sheets: RawExcelSheet[] = workbook.SheetNames.map((sheetName) => {
        const ws = workbook.Sheets[sheetName];
        if (!ws) {
          throw new Error(`Cannot read sheet "${sheetName}"`);
        }

        const rows = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          raw: true,
        }) as unknown[][];

        return {
          sheetName,
          rows: rows.filter((r) => !isRowEmpty(r)),
        };
      });

      // ✅ SAFE callback call
      totalSheetsRef.current?.(sheets.length);

      setSheetJobs(
        sheets.map((s) => ({
          sheetName: s.sheetName,
          status: "WAITING",
        })),
      );

      // 🔁 FLOW (sequential, stable)
      for (let i = 0; i < sheets.length; i++) {
        const sheet = sheets[i];

        setSheetJobs((prev) =>
          prev.map((j, idx) => (idx === i ? { ...j, status: "PENDING" } : j)),
        );

        const payload: RawExcelSheetFlowPayload = {
          fileName: file.name,
          sheet,
        };

        const { jobId } = await submit(payload);

        setSheetJobs((prev) =>
          prev.map((j, idx) => (idx === i ? { ...j, status: "RUNNING" } : j)),
        );

        const result = await waitForJobCompletion<OceanFreightResult>(
          getJob,
          jobId,
        );

        setSheetJobs((prev) =>
          prev.map((j, idx) => (idx === i ? { ...j, status: "COMPLETED" } : j)),
        );

        // ✅ SAFE emit
        sheetCompletedRef.current?.(sheet.sheetName, result);
      }
    } catch (e: any) {
      uploadErrorRef.current?.(e?.message ?? "Excel processing failed");
    }
  };

  return (
    <div className="space-y-4">
      <FileSelectButton
        onFileSelect={handleFileUpload}
        label="Select Excel File"
      />

      {fileName && <FileLabel fileName={fileName} variant="muted" />}

      {sheetJobs.map((job) => (
        <div
          key={job.sheetName}
          className="flex justify-between text-sm border rounded px-3 py-2"
        >
          <span>{job.sheetName}</span>
          <span>
            <JobStatus status={job.status} />
          </span>
        </div>
      ))}
    </div>
  );
}
