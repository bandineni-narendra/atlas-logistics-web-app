/**
 * Mock data for Sheet APIs
 * Used during development before Firebase backend is ready
 */

import { SheetSummary, DashboardStats } from "@/types/api/sheets";

export const MOCK_SHEETS: SheetSummary[] = [
  {
    id: "sheet-1",
    name: "Ocean Freight - Q1 2025",
    type: "ocean",
    rowCount: 45,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-02-01T14:20:00Z",
    status: "saved",
  },
  {
    id: "sheet-2",
    name: "Air Freight - USA Routes",
    type: "air",
    rowCount: 32,
    createdAt: "2025-01-20T09:15:00Z",
    updatedAt: "2025-01-28T11:45:00Z",
    status: "saved",
  },
  {
    id: "sheet-3",
    name: "Ocean Freight - Draft",
    type: "ocean",
    rowCount: 12,
    createdAt: "2025-02-05T16:00:00Z",
    updatedAt: "2025-02-08T09:30:00Z",
    status: "draft",
  },
  {
    id: "sheet-4",
    name: "Air Freight - India Routes",
    type: "air",
    rowCount: 28,
    createdAt: "2025-01-10T13:20:00Z",
    updatedAt: "2025-02-03T10:15:00Z",
    status: "saved",
  },
  {
    id: "sheet-5",
    name: "Ocean Freight - 2024 Archive",
    type: "ocean",
    rowCount: 156,
    createdAt: "2024-12-20T08:00:00Z",
    updatedAt: "2025-01-05T15:30:00Z",
    status: "archived",
  },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalSheets: 5,
  oceanSheets: 3,
  airSheets: 2,
  totalRows: 273,
  lastModified: "2025-02-08T09:30:00Z",
};
