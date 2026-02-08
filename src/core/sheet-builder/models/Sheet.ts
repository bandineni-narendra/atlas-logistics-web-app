/**
 * Core Sheet Builder - Sheet Model
 *
 * Generic sheet data structure.
 * Contains columns and rows - nothing domain-specific.
 */

import { Column } from "./Column";
import { Row, createEmptyRow } from "./Row";

export interface Sheet {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
}

export function createSheet(config: Partial<Sheet> & Pick<Sheet, "id">): Sheet {
  return {
    name: `Sheet ${config.id}`,
    columns: [],
    rows: [],
    ...config,
  };
}

export function addRowToSheet(sheet: Sheet): Sheet {
  const newRowId = `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const columnIds = sheet.columns.map((col) => col.id);
  const newRow = createEmptyRow(newRowId, columnIds);

  return {
    ...sheet,
    rows: [...sheet.rows, newRow],
  };
}

export function removeRowFromSheet(sheet: Sheet, rowId: string): Sheet {
  return {
    ...sheet,
    rows: sheet.rows.filter((row) => row.id !== rowId),
  };
}

export function addColumnToSheet(sheet: Sheet, column: Column): Sheet {
  // Add column to definition
  const updatedColumns = [...sheet.columns, column];

  // Add null value for this column in all existing rows
  const updatedRows = sheet.rows.map((row) => ({
    ...row,
    cells: {
      ...row.cells,
      [column.id]: null,
    },
  }));

  return {
    ...sheet,
    columns: updatedColumns,
    rows: updatedRows,
  };
}

export function removeColumnFromSheet(sheet: Sheet, columnId: string): Sheet {
  // Remove column from definition
  const updatedColumns = sheet.columns.filter((col) => col.id !== columnId);

  // Remove column from all rows
  const updatedRows = sheet.rows.map((row) => {
    const { [columnId]: removed, ...remainingCells } = row.cells;
    return {
      ...row,
      cells: remainingCells,
    };
  });

  return {
    ...sheet,
    columns: updatedColumns,
    rows: updatedRows,
  };
}

export function updateCellValue(
  sheet: Sheet,
  rowId: string,
  columnId: string,
  value: string | number | boolean | null,
): Sheet {
  const updatedRows = sheet.rows.map((row) => {
    if (row.id !== rowId) return row;

    return {
      ...row,
      cells: {
        ...row.cells,
        [columnId]: value,
      },
    };
  });

  return {
    ...sheet,
    rows: updatedRows,
  };
}
