/**
 * API Configuration - Single Source of Truth
 *
 * FAANG Standard: All API settings centralized
 * - Easy to switch environments
 * - Type-safe configuration
 * - Version control in one place
 */

export const API_CONFIG = {
  /**
   * API Base URL - automatically determined by environment
   */
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",

  /**
   * API Version - change once, applies everywhere
   */
  version: "v1",

  /**
   * Full API path with version
   */
  get apiPath(): string {
    return `/api/${this.version}`;
  },

  /**
   * Timeout settings
   */
  timeout: {
    default: 30_000, // 30 seconds
    upload: 120_000, // 2 minutes for file uploads
    longRunning: 300_000, // 5 minutes for heavy operations
  },

  /**
   * Retry configuration
   */
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  },

  /**
   * Feature flags
   */
  features: {
    enableRequestLogging: process.env.NODE_ENV === "development",
    enableResponseCaching: process.env.NODE_ENV === "production",
  },
} as const;

/**
 * Endpoint builders for type safety
 */
export const ENDPOINTS = {
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
    verify: "/auth/verify",
    me: "/auth/me",
    profile: "/auth/profile",
    google: "/auth/google",
  },

  files: {
    list: "/files",
    detail: (id: string) => `/files/${id}`,
    create: "/files",
    update: (id: string) => `/files/${id}`,
    delete: (id: string) => `/files/${id}`,
  },

  air: {
    files: "/air/files",
    fileDetail: (id: string) => `/air/files/${id}`,
    stats: "/air/dashboard/stats",
  },

  ocean: {
    files: "/ocean/files",
    fileDetail: (id: string) => `/ocean/files/${id}`,
    stats: "/ocean/dashboard/stats",
  },

  excelFlow: {
    jobs: "/excel-flow/jobs",
    jobStatus: (jobId: string) => `/excel-flow/jobs/${jobId}`,
    multiSheet: "/excel-flow/multi-sheet",
    airFreight: "/excel-flow/air-freight",
    airFreightSingle: "/excel-flow/air-freight/single",
  },
} as const;

/**
 * Type-safe environment configuration
 */
export interface AppConfig {
  apiUrl: string;
  environment: "development" | "staging" | "production";
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
}

export const appConfig: AppConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  environment: (process.env.NODE_ENV as any) || "development",
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
};
