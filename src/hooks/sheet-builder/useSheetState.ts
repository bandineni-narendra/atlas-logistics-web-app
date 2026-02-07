/**
 * Core Sheet Builder - Sheet State Hook
 *
 * Manages state for a single sheet.
 * Generic - no domain logic.
 */

"use client";

import { useState, useCallback } from "react";
import {
  Sheet,
  updateCellValue,
  addRowToSheet,
  removeRowFromSheet,
  addColumnToSheet,
  removeColumnFromSheet,
} from "@/core/sheet-builder/models";
import { Column } from "@/core/sheet-builder/models";
import { CellValue } from "@/core/sheet-builder/types";

export interface UseSheetStateReturn {
  sheet: Sheet;
  updateCell: (rowId: string, columnId: string, value: CellValue) => void;
  addRow: () => void;
  removeRow: (rowId: string) => void;
  addColumn: (column: Column) => void;
  removeColumn: (columnId: string) => void;
  setSheet: (sheet: Sheet) => void;
}

export function useSheetState(initialSheet: Sheet): UseSheetStateReturn {
  const [sheet, setSheet] = useState<Sheet>(initialSheet);

  const updateCell = useCallback(
    (rowId: string, columnId: string, value: CellValue) => {
      setSheet((currentSheet) =>
        updateCellValue(currentSheet, rowId, columnId, value),
      );
    },
    [],
  );

  const addRow = useCallback(() => {
    setSheet((currentSheet) => addRowToSheet(currentSheet));
  }, []);

  const removeRow = useCallback((rowId: string) => {
    setSheet((currentSheet) => removeRowFromSheet(currentSheet, rowId));
  }, []);

  const addColumn = useCallback((column: Column) => {
    setSheet((currentSheet) => addColumnToSheet(currentSheet, column));
  }, []);

  const removeColumn = useCallback((columnId: string) => {
    setSheet((currentSheet) => removeColumnFromSheet(currentSheet, columnId));
  }, []);

  return {
    sheet,
    updateCell,
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    setSheet,
  };
}
