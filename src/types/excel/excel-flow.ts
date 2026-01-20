/**
 * Flow-specific Excel types
 * Used ONLY for sequential, sheet-by-sheet processing
 * (Kotlin Flow–style)
 */

import { RawExcelSheet } from "./excel";
import { OceanFreightResult } from "@/types/ocean";

/**
 * Payload sent per API call (ONE sheet)
 */
export type RawExcelSheetFlowPayload = {
  fileName: string;
  sheet: RawExcelSheet;
};

/**
 * Sheet processing lifecycle (frontend only)
 */
export type SheetFlowStatus =
  | "WAITING"
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

/**
 * Frontend-only state for a sheet in the Flow
 */
export type SheetFlowState = {
  sheetName: string;
  status: SheetFlowStatus;
  result?: OceanFreightResult;
  error?: string;
};
