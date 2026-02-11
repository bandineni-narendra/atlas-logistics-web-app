import axios from "axios";
import { RawExcelPayload } from "@/types/excel/excel";
import { RawExcelSheetFlowPayload } from "@/types/excel/excel-flow";

// Use relative path - Next.js will rewrite to backend API
const api = axios.create({
  baseURL: "/api",
  timeout: 120_000,
  withCredentials: true,
});

/**
 * -----------------------------
 * LEGACY APIs (UNCHANGED)
 * -----------------------------
 */

/**
 * Single sheet processing - ACTUAL backend endpoint
 */
export async function createExcelJob(payload: RawExcelPayload) {
  const res = await api.post("/excel-flow/jobs", payload);
  return res.data as { jobId: string };
}

/**
 * Multi-sheet with AI processing - ACTUAL backend endpoint
 */
export async function createMutliSheetExcelJob(payload: RawExcelPayload) {
  const res = await api.post("/excel-flow/multi-sheet", payload);
  return res.data as { jobId: string };
}

/**
 * Get job status/result - ACTUAL backend endpoint
 */
export async function getExcelJob(jobId: string) {
  const res = await api.get(`/excel-flow/jobs/${jobId}`);
  return res.data;
}

/**
 * -----------------------------
 * FLOW APIs (NEW, CORRECT)
 * -----------------------------
 */

/**
 * ✅ Create job for ONE sheet (Flow-based) - ACTUAL backend endpoint
 */
export async function createExcelFlowJob(payload: RawExcelSheetFlowPayload) {
  const res = await api.post("/excel-flow/jobs", payload);
  return res.data as { jobId: string };
}

/**
 * ✅ Get Flow job status/result - ACTUAL backend endpoint
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
 * ✅ Create job for ONE sheet (Air Freight) - ACTUAL backend endpoint
 */
export async function createAirFreightFlowJob(
  payload: RawExcelSheetFlowPayload,
) {
  const res = await api.post("/excel-flow/air-freight", payload);
  return res.data as { jobId: string };
}

/**
 * ✅ Get Air Freight job status/result - ACTUAL backend endpoint
 */
export async function getAirFreightJob(jobId: string) {
  const res = await api.get(`/excel-flow/jobs/${jobId}`);
  return res.data;
}
