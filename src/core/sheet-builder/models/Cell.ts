/**
 * Core Sheet Builder - Cell Model
 *
 * Generic cell value container.
 * No domain validation.
 */

import { CellValue } from "../types";

export interface Cell {
  columnId: string;
  value: CellValue;
  error?: string;
}

export function createCell(columnId: string, value: CellValue = null): Cell {
  return {
    columnId,
    value,
  };
}
