import axios from "axios";
import { RawExcelPayload } from "@/types/excel/excel";
import { RawExcelSheetFlowPayload } from "@/types/excel/excel-flow";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 120_000,
});

/**
 * -----------------------------
 * LEGACY APIs (UNCHANGED)
 * -----------------------------
 */

/**
 * Single job for ALL sheets (legacy)
 */
export async function createExcelJob(payload: RawExcelPayload) {
  const res = await api.post("/excel/jobs", payload);
  return res.data as { jobId: string };
}

/**
 * Explicit multi-sheet backend job (legacy)
 */
export async function createMutliSheetExcelJob(payload: RawExcelPayload) {
  const res = await api.post("/excel/jobs/multi-sheet", payload);
  return res.data as { jobId: string };
}

/**
 * Get job status/result (legacy)
 */
export async function getExcelJob(jobId: string) {
  const res = await api.get(`/excel/jobs/${jobId}`);
  return res.data;
}

/**
 * -----------------------------
 * FLOW APIs (NEW, CORRECT)
 * -----------------------------
 */

/**
 * ✅ Create job for ONE sheet (Flow-based)
 */
export async function createExcelFlowJob(payload: RawExcelSheetFlowPayload) {
  const res = await api.post("/excel-flow/jobs", payload);
  return res.data as { jobId: string };
}

/**
 * ✅ Get Flow job status/result
 */
export async function getExcelFlowJob(jobId: string) {
  const res = await api.get(`/excel-flow/jobs/${jobId}`);
  return res.data;
}

/**
 * -----------------------------
 * AIR FREIGHT FLOW APIs
 * -----------------------------
 */

/**
 * ✅ Create job for ONE sheet (Air Freight Flow-based)
 */
export async function createAirFreightFlowJob(
  payload: RawExcelSheetFlowPayload,
) {
  const res = await api.post("/excel/jobs/air-freight/single", payload);
  return res.data as { jobId: string };
}

/**
 * ✅ Get Air Freight job status/result
 */
export async function getAirFreightJob(jobId: string) {
  const res = await api.get(`/excel/jobs/${jobId}`);
  return res.data;
}
