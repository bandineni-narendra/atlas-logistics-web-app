/**
 * Core Sheet Builder - Row Model
 *
 * Generic row data structure.
 * No business rules.
 */

import { CellValue } from "../types";

export interface Row {
  id: string;
  cells: Record<string, CellValue>;
}

export function createRow(
  id: string,
  cells: Record<string, CellValue> = {},
): Row {
  return {
    id,
    cells,
  };
}

export function createEmptyRow(id: string, columnIds: string[]): Row {
  const cells: Record<string, CellValue> = {};
  columnIds.forEach((colId) => {
    cells[colId] = null;
  });
  return createRow(id, cells);
}
