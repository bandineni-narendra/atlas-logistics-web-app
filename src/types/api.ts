/**
 * Unified API Types
 *
 * Single source of truth for all backend API request/response types.
 * Matches the Atlas Logistics Backend API v1 contract.
 */

// ============================================
// Auth Types
// ============================================

export interface User {
    id: string;
    email: string;
    name: string;
    orgId: string;
    avatar?: string;
    provider: "manual" | "google" | "github" | "microsoft";
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface VerifyTokenRequest {
    idToken: string;
}

export interface UpdateProfileRequest {
    name?: string;
    avatar?: string;
}

// ============================================
// File Types
// ============================================

export type FileType = "AIR" | "OCEAN";
export type FileStatus = "draft" | "saved" | "archived";

export interface SheetColumn {
    id: string;
    label: string;
    type: "text" | "number" | "select";
    options?: string[];
}

export interface SheetRow {
    id: string;
    cells: Record<string, string | number | boolean | null>;
}

export interface SheetData {
    id: string;
    name: string;
    columns: SheetColumn[];
    rows: SheetRow[];
}

export interface CreateSheet {
    name: string;
    data: SheetData;
}

export interface CreateFileRequest {
    name: string;
    type: FileType;
    effectiveDate: string;
    sheets: CreateSheet[];
}

export interface CreateFileResponse {
    fileId: string;
    sheetIds: string[];
    message: string;
}

export interface FileSummary {
    id: string;
    name: string;
    type: FileType;
    status: FileStatus;
    effectiveDate: string;
    createdAt: string;
    updatedAt: string;
    sheetCount: number;
    createdBy: string;
}

export interface GetFilesParams {
    type?: FileType;
    status?: FileStatus;
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
}

export interface GetFilesResponse {
    files: FileSummary[];
    total: number;
    page: number;
    pageSize: number;
}

export interface SheetSummary {
    id: string;
    name: string;
    columnCount: number;
    rowCount: number;
    createdAt: string;
}

export interface FileDetail {
    id: string;
    name: string;
    type: FileType;
    status: FileStatus;
    effectiveDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    sheets: SheetSummary[];
}

export interface SheetWithData {
    id: string;
    name: string;
    data: SheetData;
}

export interface UpdateFileRequest {
    name?: string;
    effectiveDate?: string;
    status?: FileStatus;
}

export interface UpdateFileResponse {
    success: boolean;
    message: string;
}

export interface DeleteFileResponse {
    success: boolean;
    message: string;
}

// ============================================
// Excel Processing Types
// ============================================

export interface ExcelSheet {
    sheetName: string;
    rows: unknown[][];
}

export interface ProcessSheetRequest {
    fileName: string;
    sheet: ExcelSheet;
}

export interface JobResponse {
    jobId: string;
}

export type JobStatusValue = "pending" | "processing" | "completed" | "failed";

export interface JobStatus {
    jobId: string;
    status: JobStatusValue;
    result?: unknown;
    error?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MultiSheetRequest {
    fileName: string;
    sheets: ExcelSheet[];
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
// Error Types
// ============================================

export interface ApiErrorResponse {
    statusCode: number;
    message: string | string[];
    error?: string;
}

export interface ApiResponse<T = unknown> {
    data?: T;
    error?: ApiErrorResponse;
    success: boolean;
}
