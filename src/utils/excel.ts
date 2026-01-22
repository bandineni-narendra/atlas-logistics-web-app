// Pure utility functions for Excel processing (framework-agnostic)

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRowEmpty(row: unknown[]): boolean {
  return row.every(
    (cell) =>
      cell === null ||
      cell === undefined ||
      (typeof cell === "string" && cell.trim() === ""),
  );
}

export async function waitForJobCompletion<T>(
  getJob: (jobId: string) => Promise<any>,
  jobId: string,
): Promise<T> {
  while (true) {
    const job = await getJob(jobId);
    if (job.status === "COMPLETED") {
      return job.result as T;
    }
    if (job.status === "FAILED") {
      throw new Error(job.error ?? "Sheet processing failed");
    }
    await sleep(1000);
  }
}
