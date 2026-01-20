import { createMutliSheetExcelJob, getExcelJob } from "@/api/client";
import { useEffect, useState } from "react";
import { RawExcelPayload, MultiSheetResult } from "@/types/excel/excel";

export function useMultiSheetExcelJob() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<MultiSheetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: RawExcelPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { jobId } = await createMutliSheetExcelJob(payload);
      setJobId(jobId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create job";
      setError(errorMsg);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const data = await getExcelJob(jobId);
        setJob(data);

        if (data.status === "COMPLETED" || data.status === "FAILED") {
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch job";
        setError(errorMsg);
        setLoading(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  return { submit, job, loading, error };
}
