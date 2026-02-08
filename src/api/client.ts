import axios from "axios";
import { RawExcelPayload } from "@/types/excel/excel";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 120_000, // short timeout is OK now
});

export async function createExcelJob(payload: RawExcelPayload) {
  const res = await api.post("/excel/jobs", payload);
  return res.data as { jobId: string };
}

export async function createMutliSheetExcelJob(payload: RawExcelPayload) {
  const res = await api.post("/excel/jobs/multi-sheet", payload);
  return res.data as { jobId: string };
}

export async function createAirFreightJob(payload: RawExcelPayload) {
  const res = await api.post("/excel/jobs/air-freight", payload);
  return res.data as { jobId: string };
}

export async function getExcelJob(jobId: string) {
  const res = await api.get(`/excel/jobs/${jobId}`);
  return res.data;
}
