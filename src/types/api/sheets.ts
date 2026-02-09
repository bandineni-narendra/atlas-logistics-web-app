/**
 * API Types for Sheet Data
 * Types for requests and responses from sheet-related APIs
 */

import { Sheet } from "@/core/sheet-builder";

export interface SheetSummary {
  id: string;
  name: string;
  type: "ocean" | "air";
  rowCount: number;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "saved" | "archived";
}

export interface SheetDetail extends SheetSummary {
  sheet: Sheet;
}

export interface GetSheetsResponse {
  sheets: SheetSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetSheetDetailResponse {
  sheet: SheetDetail;
}

export interface CreateSheetRequest {
  name: string;
  type: "ocean" | "air";
  data: Sheet;
}

export interface UpdateSheetRequest {
  name?: string;
  data?: Sheet;
  status?: "draft" | "saved" | "archived";
}

export interface DeleteSheetResponse {
  success: boolean;
  message: string;
}

export interface DashboardStats {
  totalSheets: number;
  oceanSheets: number;
  airSheets: number;
  totalRows: number;
  lastModified: string;
}

export interface GetDashboardStatsResponse {
  stats: DashboardStats;
}
