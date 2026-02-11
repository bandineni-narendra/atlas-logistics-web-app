/**
 * Backend API Type Definitions
 * Based on Backend Integration Guide
 */

// ============================================
// Enums
// ============================================

export enum FileType {
  AIR = "AIR",
  OCEAN = "OCEAN",
}

export enum FileStatus {
  DRAFT = "draft",
  SAVED = "saved",
  ARCHIVED = "archived",
}

export enum JobStatus {
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

// ============================================
// Authentication
// ============================================

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  orgName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyRequest {
  idToken: string;
}

export interface AuthResponse {
  uid: string;
  email: string;
  displayName: string;
  orgId: string;
  customToken: string;
}

export interface VerifyResponse {
  uid: string;
  email: string;
  displayName: string | null;
  orgId: string;
}

// ============================================
// Files
// ============================================

export interface FileEntity {
  id: string;
  fileName: string;
  fileType: FileType;
  status: FileStatus;
  createdAt: string;
  lastModified: string;
  orgId: string;
}

export interface CreateFileRequest {
  fileName: string;
  fileType: FileType;
  status: FileStatus;
  // Note: orgId is extracted from token, NOT sent in request
}

export interface UpdateFileRequest {
  fileName?: string;
  fileType?: FileType;
  status?: FileStatus;
}

// ============================================
// Excel Processing
// ============================================

export interface ProcessSheetRequest {
  fileUrl: string;
  sheetName?: string;
  fileType: FileType;
}

export interface ProcessMultiSheetRequest {
  fileUrl: string;
  fileType: FileType;
}

export interface ParseRuleBasedRequest {
  fileUrl: string;
  sheetName?: string;
}

export interface ParseAirFreightRequest {
  fileUrl: string;
  sheetName?: string;
}

export interface JobResponse {
  jobId: string;
  status: JobStatus;
  result?: any;
}

export interface MultiSheetResponse {
  jobId: string;
  status: JobStatus;
  sheets: Array<{
    sheetName: string;
    data: any;
  }>;
}

export interface ParsedDataResponse {
  data: {
    headers: string[];
    rows: Array<Record<string, any>>;
  };
  metadata: {
    sheetType: "AIR" | "OCEAN";
    rowCount: number;
    columnCount: number;
  };
}

export interface JobStatusResponse {
  jobId: string;
  status: JobStatus;
  progress?: number;
  result?: any;
  error?: string;
}

// ============================================
// Health Check
// ============================================

export interface HealthResponse {
  status: "ok";
  timestamp: string;
  uptime: number;
}

// ============================================
// Error Responses
// ============================================

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

export interface ValidationErrorResponse {
  statusCode: 400;
  message: string[]; // Array of validation errors
  error: "Bad Request";
}

export interface UnauthorizedErrorResponse {
  statusCode: 401;
  message: "Unauthorized";
  error: "Unauthorized";
}

export interface ForbiddenErrorResponse {
  statusCode: 403;
  message: "Forbidden resource";
  error: "Forbidden";
}

export interface NotFoundErrorResponse {
  statusCode: 404;
  message: string;
  error: "Not Found";
}

export interface RateLimitErrorResponse {
  statusCode: 429;
  message: "ThrottlerException: Too Many Requests";
  error: "Too Many Requests";
}
