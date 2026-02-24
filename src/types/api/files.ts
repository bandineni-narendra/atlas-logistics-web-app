/**
 * File API Types - Domain Separated (Air & Ocean)
 *
 * Request and response types for File-related API operations.
 * These define the contract between frontend and backend.
 *
 * Air Freight: /api/air/*
 * Ocean Freight: /api/ocean/*
 */

import { Sheet } from "@/core/sheet-builder";
import { FileSummary, FileDetail, FileType, FileStatus } from "../file";

/**
 * Request to create a new file with sheets
 * Note: orgId is NOT sent in request body - extracted from JWT token by backend
 */
export interface CreateFileRequest {
  /** File metadata */
  name: string;
  type: FileType; // Routes to /api/air or /api/ocean
  effectiveDate: string;
  orgId: string; // Used internally - NOT sent to backend

  /** All sheets belonging to this file */
  sheets: Array<{
    name: string;
    data: Sheet;
  }>;
}

/**
 * Response from file creation
 */
export interface CreateFileResponse {
  /** ID of the newly created file */
  fileId: string;

  /** IDs of all created sheets */
  sheetIds: string[];

  /** Success message */
  message: string;
}

/**
 * Request to update file metadata
 */
export interface UpdateFileRequest {
  name?: string;
  effectiveDate?: string;
  status?: FileStatus;
  clientEmail?: string;
  sheets?: Array<{
    name: string;
    data: Sheet;
  }>;
}

/**
 * Response from file update
 */
export interface UpdateFileResponse {
  success: boolean;
  message: string;
}

/**
 * Request to get files with pagination and filters
 * Type is REQUIRED to route to correct endpoint (/api/air or /api/ocean)
 */
export interface GetFilesRequest {
  page?: number;
  pageSize?: number;
  type: FileType; // REQUIRED - determines endpoint routing
  status?: FileStatus;
  startDate?: string; // ISO date (YYYY-MM-DD)
  endDate?: string; // ISO date (YYYY-MM-DD)
  search?: string;
}

/**
 * Response containing paginated files
 * Response structure matches backend format (items instead of files)
 */
export interface GetFilesResponse {
  items: FileSummary[]; // Backend uses 'items' not 'files'
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Response for single file detail
 */
export interface GetFileDetailResponse {
  file: FileDetail;
}

/**
 * Response for deleting a file
 */
export interface DeleteFileResponse {
  success: boolean;
  message: string;
}

/**
 * Dashboard statistics
 * Separated by domain - call /api/air/dashboard/stats or /api/ocean/dashboard/stats
 */
export interface FileDashboardStats {
  totalFiles: number;
  totalSheets: number;
  totalRows: number;
  lastModified: string;
}

export interface GetFileDashboardStatsResponse {
  stats: FileDashboardStats;
}
