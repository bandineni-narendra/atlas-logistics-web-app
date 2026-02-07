/**
 * Core Sheet Builder - Column Types
 *
 * Generic column type definitions for the sheet builder.
 * Domain-agnostic - no business logic.
 */

export enum ColumnType {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  SELECT = "select",
  BOOLEAN = "boolean",
}

export type CellValue = string | number | boolean | null;

export interface ColumnOption {
  label: string;
  value: string | number;
}
