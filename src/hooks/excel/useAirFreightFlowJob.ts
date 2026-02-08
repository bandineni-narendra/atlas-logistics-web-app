import { createAirFreightFlowJob, getAirFreightJob } from "@/api/flow_client";
import { RawExcelSheetFlowPayload } from "@/types/excel/excel-flow";

export type AirFreightJobStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

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
    payload: RawExcelSheetFlowPayload,
  ): Promise<{ jobId: string }> => {
    return await createAirFreightFlowJob(payload);
  };

  const getJob = async <T = unknown>(
    jobId: string,
  ): Promise<AirFreightJob<T>> => {
    return await getAirFreightJob(jobId);
  };

  return { submit, getJob };
}
