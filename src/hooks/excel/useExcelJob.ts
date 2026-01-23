import { createExcelJob, createAirFreightJob, getExcelJob } from "@/api/client";
import { useEffect, useState, useCallback } from "react";
import { RawExcelPayload } from "@/types/excel/excel";

export type ExcelJobEndpoint = "ocean" | "air";

export function useExcelJob(endpoint: ExcelJobEndpoint = "ocean") {
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (payload: RawExcelPayload) => {
      setLoading(true);
      const createFn =
        endpoint === "air" ? createAirFreightJob : createExcelJob;
      const { jobId } = await createFn(payload);
      setJobId(jobId);
    },
    [endpoint],
  );

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const data = await getExcelJob(jobId);
      setJob(data);

      if (data.status === "COMPLETED" || data.status === "FAILED") {
        setLoading(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  return { submit, job, loading };
}
