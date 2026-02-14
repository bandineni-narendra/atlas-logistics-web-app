/**
 * useMultiSheetExcelJob Hook
 *
 * Multi-sheet job submission with polling.
 * Uses the new excelService.
 */

import { excelService } from "@/services/excelService";
import { useEffect, useState } from "react";
import type { MultiSheetRequest } from "@/types/api";

export function useMultiSheetExcelJob() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: MultiSheetRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await excelService.processMultiSheet(payload);
      setJobId(response.jobId);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create job";
      setError(errorMsg);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const data = await excelService.getJobStatus(jobId);
        setJob(data);

        if (data.status === "completed" || data.status === "failed") {
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch job";
        setError(errorMsg);
        setLoading(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  return { submit, job, loading, error };
}
