/**
 * useAirFreightFlowJob Hook
 *
 * Flow-based: submit ONE sheet for air freight processing.
 * Uses the new excelService.
 */

import { excelService } from "@/services/excelService";
import type { ProcessSheetRequest } from "@/types/api";

export type AirFreightJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type AirFreightJob<T = unknown> = {
  id: string;
  status: AirFreightJobStatus;
  result?: T;
  error?: string;
};

export function useAirFreightFlowJob() {
  /**
   * Flow-based: submit ONE sheet for air freight processing
   */
  const submit = async (
    payload: ProcessSheetRequest,
  ): Promise<{ jobId: string }> => {
    return await excelService.createProcessingJob(payload);
  };

  const getJob = async <T = unknown>(
    jobId: string,
  ): Promise<AirFreightJob<T>> => {
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
