import axios from "axios";
import { RawExcelPayload } from "@/types/excel/excel";
import { auth } from "@/config/firebase";

// Use relative path - Next.js will rewrite to backend API
const API_URL = "/api";

// Create API client
const api = axios.create({
  baseURL: API_URL,
  timeout: 120_000,
  withCredentials: true,
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

// Handle authentication errors and rate limiting
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - try refreshing token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const user = auth.currentUser;
      if (user) {
        try {
          // Force refresh token
          const token = await user.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api.request(originalRequest);
        } catch (refreshError) {
          // Token refresh failed - redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      } else {
        // No user - redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    // Handle 429 Rate Limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"] || "60";
      console.error(`Rate limited. Retry after ${retryAfter} seconds`);
      // You can show a toast notification here
    }

    return Promise.reject(error);
  },
);

// Export the configured client
export const apiClient = api;

// Excel job functions - matched to ACTUAL backend endpoints
export async function createExcelJob(payload: RawExcelPayload) {
  const res = await api.post("/excel-flow/jobs", payload);
  return res.data as { jobId: string };
}

export async function createMutliSheetExcelJob(payload: RawExcelPayload) {
  const res = await api.post("/excel-flow/multi-sheet", payload);
  return res.data as { jobId: string };
}

export async function createAirFreightJob(payload: RawExcelPayload) {
  const res = await api.post("/excel-flow/air-freight", payload);
  return res.data as { jobId: string };
}

export async function getExcelJob(jobId: string) {
  const res = await api.get(`/excel-flow/jobs/${jobId}`);
  return res.data;
}
