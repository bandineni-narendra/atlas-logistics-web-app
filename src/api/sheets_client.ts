/**
 * Sheet Data API Client
 * Handles all sheet-related API calls
 * Currently uses mock data, will be replaced with Firebase API calls
 */

import {
  SheetSummary,
  GetSheetsResponse,
  GetSheetDetailResponse,
  CreateSheetRequest,
  UpdateSheetRequest,
  DeleteSheetResponse,
  GetDashboardStatsResponse,
} from "@/types/api/sheets";
import { MOCK_SHEETS, MOCK_DASHBOARD_STATS } from "./mockData";

/**
 * Get all sheets with pagination
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page
 * @param type - Filter by sheet type (optional)
 */
export async function getSheets(
  page: number = 1,
  pageSize: number = 10,
  type?: "ocean" | "air",
): Promise<GetSheetsResponse> {
  // TODO: Replace with actual Firebase API call
  // const response = await fetch('/api/sheets?page=${page}&pageSize=${pageSize}');

  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      let filteredSheets = MOCK_SHEETS;

      if (type) {
        filteredSheets = filteredSheets.filter((sheet) => sheet.type === type);
      }

      const startIdx = (page - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      const paginatedSheets = filteredSheets.slice(startIdx, endIdx);

      resolve({
        sheets: paginatedSheets,
        total: filteredSheets.length,
        page,
        pageSize,
      });
    }, 300);
  });
}

/**
 * Get a single sheet by ID with full details
 * @param sheetId - The sheet ID
 */
export async function getSheetDetail(
  sheetId: string,
): Promise<GetSheetDetailResponse> {
  // TODO: Replace with actual Firebase API call
  // const response = await fetch(`/api/sheets/${sheetId}`);

  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const sheet = MOCK_SHEETS.find((s) => s.id === sheetId);

      if (!sheet) {
        reject(new Error(`Sheet not found: ${sheetId}`));
        return;
      }

      // In a real app, this would fetch the full sheet data from Firebase
      resolve({
        sheet: {
          ...sheet,
          sheet: {
            id: sheet.id,
            name: sheet.name,
            columns: [],
            rows: [],
          },
        },
      });
    }, 300);
  });
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<GetDashboardStatsResponse> {
  // TODO: Replace with actual Firebase API call
  // const response = await fetch('/api/dashboard/stats');

  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve({
        stats: MOCK_DASHBOARD_STATS,
      });
    }, 300);
  });
}

/**
 * Create a new sheet
 * @param data - Sheet creation data
 */
export async function createSheet(
  data: CreateSheetRequest,
): Promise<{ id: string }> {
  // TODO: Replace with actual Firebase API call
  // const response = await fetch('/api/sheets', {
  //   method: 'POST',
  //   body: JSON.stringify(data)
  // });

  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = `sheet-${Date.now()}`;
      resolve({ id: newId });
    }, 300);
  });
}

/**
 * Update an existing sheet
 * @param sheetId - The sheet ID
 * @param data - Sheet update data
 */
export async function updateSheet(
  sheetId: string,
  data: UpdateSheetRequest,
): Promise<{ success: boolean }> {
  // TODO: Replace with actual Firebase API call
  // const response = await fetch(`/api/sheets/${sheetId}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data)
  // });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
}

/**
 * Delete a sheet
 * @param sheetId - The sheet ID
 */
export async function deleteSheet(
  sheetId: string,
): Promise<DeleteSheetResponse> {
  // TODO: Replace with actual Firebase API call
  // const response = await fetch(`/api/sheets/${sheetId}`, {
  //   method: 'DELETE'
  // });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Sheet ${sheetId} deleted successfully`,
      });
    }, 300);
  });
}
