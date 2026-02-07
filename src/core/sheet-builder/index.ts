/**
 * Core Sheet Builder - Public API
 *
 * Generic, domain-agnostic Excel-like sheet builder.
 * Export only what's needed for external use.
 */

// Main component
export * from "./SheetBuilder";

// Models (for configuration)
export type { Sheet, Column, Row } from "./models";
export { createColumn } from "./models";

// Types (for configuration)
export { ColumnType } from "./types";
export type { CellValue, ColumnOption } from "./types";

// Hooks (for advanced usage) - re-export from hooks folder
export { useSheetManager, useSheetState } from "@/hooks/sheet-builder";
export type {
  UseSheetManagerReturn,
  UseSheetStateReturn,
} from "@/hooks/sheet-builder";
