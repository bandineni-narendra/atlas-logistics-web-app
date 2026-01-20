import { createExcelFlowJob, getExcelJob } from "@/api/flow_client";
import { RawExcelSheetFlowPayload } from "@/types/excel/excel-flow";

export type ExcelJobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

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
    payload: RawExcelSheetFlowPayload,
  ): Promise<{ jobId: string }> => {
    return await createExcelFlowJob(payload);
  };

  const getJob = async <T = unknown>(jobId: string): Promise<ExcelJob<T>> => {
    return await getExcelJob(jobId);
  };

  return { submit, getJob };
}
