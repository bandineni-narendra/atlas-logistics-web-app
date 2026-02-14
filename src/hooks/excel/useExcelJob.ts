/**
 * useExcelJob Hook (Legacy)
 *
 * Single/air-freight job submission with polling.
 * Uses the new excelService.
 */

import { excelService } from "@/services/excelService";
import { useEffect, useState, useCallback } from "react";
import type { MultiSheetRequest, JobStatus } from "@/types/api";

export type ExcelJobEndpoint = "ocean" | "air";

export function useExcelJob(endpoint: ExcelJobEndpoint = "ocean") {
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (payload: MultiSheetRequest) => {
      setLoading(true);
      const response =
        endpoint === "air"
          ? await excelService.parseAirFreight(payload)
          : await excelService.processMultiSheet(payload);
      setJobId(response.jobId);
    },
    [endpoint],
  );

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const data = await excelService.getJobStatus(jobId);
      setJob(data);

      if (data.status === "completed" || data.status === "failed") {
        setLoading(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  return { submit, job, loading };
}
