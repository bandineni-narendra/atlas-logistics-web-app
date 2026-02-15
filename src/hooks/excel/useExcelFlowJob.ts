/**
 * useExcelFlowJob Hook
 *
 * Flow-based: submit ONE sheet for processing.
 * Uses the new excelService.
 */

import { excelService } from "@/services/excelService";
import type { ProcessSheetRequest } from "@/types/api";

export type ExcelJobStatus = "pending" | "processing" | "completed" | "failed";

export type ExcelJob<T = unknown> = {
  id: string;
  status: ExcelJobStatus;
  result?: T;
  error?: string;
};

export function useExcelJob() {
  /**
   * Flow-based: submit ONE sheet
   */
  const submit = async (
    payload: ProcessSheetRequest,
  ): Promise<{ jobId: string }> => {
    return await excelService.createProcessingJob(payload);
  };

  const getJob = async <T = unknown>(jobId: string): Promise<ExcelJob<T>> => {
    const status = await excelService.getJobStatus(jobId);
    return {
      id: status.jobId,
      status: status.status,
      result: status.result as T,
      error: status.error,
    };
  };

  return { submit, getJob };
}
