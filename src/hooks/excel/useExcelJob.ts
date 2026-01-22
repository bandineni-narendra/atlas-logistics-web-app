import { createExcelJob, getExcelJob } from "@/api/client";
import { useEffect, useState } from "react";
import { RawExcelPayload } from "@/types/excel/excel";

export function useExcelJob() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (payload: RawExcelPayload) => {
    setLoading(true);
    const { jobId } = await createExcelJob(payload);
    setJobId(jobId);
  };

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
