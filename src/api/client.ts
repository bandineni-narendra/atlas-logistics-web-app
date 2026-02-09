import axios from "axios";
import { RawExcelPayload } from "@/types/excel/excel";
import { auth } from "@/config/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create API client
const api = axios.create({
  baseURL: API_URL,
  timeout: 120_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Firebase token to all requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      // Get fresh token (Firebase auto-refreshes if expired)
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Export the configured client
export const apiClient = api;

// Excel job functions
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
