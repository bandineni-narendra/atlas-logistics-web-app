/**
 * Core Sheet Builder - Main Component
 *
 * Generic, reusable Excel-like sheet builder.
 * Completely domain-agnostic.
 *
 * Features:
 * - Multiple sheets with tabs
 * - Add/remove rows and columns
 * - Inline editable cells
 * - Configurable via props
 *
 * @example
 * ```tsx
 * <SheetBuilder
 *   initialColumns={myColumns}
 *   onChange={(sheets) => console.log(sheets)}
 * />
 * ```
 */

"use client";

import { useEffect } from "react";
import { Column, createSheet } from "./models";
import { useSheetManager } from "@/hooks/sheet-builder";
import { SheetTabs, SheetTable } from "@/components/sheet-builder";

export interface SheetBuilderProps {
  /**
   * Initial column definitions.
   * Defines the structure of the sheet.
   */
  initialColumns?: Column[];

  /**
   * Callback when sheet data changes.
   * Returns all sheets for export/validation.
   */
  onChange?: (sheets: ReturnType<typeof useSheetManager>["sheets"]) => void;

  /**
   * Enable/disable multiple sheets.
   * Default: true
   */
  multiSheet?: boolean;

  /**
   * Optional localStorage key for persisting sheet data.
   * If provided, data will be saved and restored from localStorage.
   */
  storageKey?: string;
}

export function SheetBuilder({
  initialColumns = [],
  onChange,
  multiSheet = true,
  storageKey,
}: SheetBuilderProps) {
  const {
    sheets,
    activeSheetId,
    activeSheet,
    addSheet,
    removeSheet,
    setActiveSheet,
    updateSheet,
    updateSheetName,
    resetSheet,
  } = useSheetManager([
    createSheet({
      id: "1",
      name: "Sheet 1",
      columns: initialColumns,
      rows: [],
    }),
  ], storageKey);

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange(sheets);
    }
  }, [sheets, onChange]);

  if (!activeSheet) {
    return <div className="p-8 text-center text-[var(--on-surface-variant)]">No active sheet</div>;
  }

  const handleCellChange = (rowId: string, columnId: string, value: any) => {
    updateSheet(activeSheetId, (sheet) => {
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
      return { ...sheet, rows: updatedRows };
    });
  };

  const handleAddRow = () => {
    updateSheet(activeSheetId, (sheet) => {
      const newRowId = `row-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const cells: Record<string, string | number | boolean | null> = {};
      sheet.columns.forEach((col) => {
        cells[col.id] = null;
      });
      return {
        ...sheet,
        rows: [...sheet.rows, { id: newRowId, cells }],
      };
    });
  };

  const handleDeleteRow = (rowId: string) => {
    updateSheet(activeSheetId, (sheet) => ({
      ...sheet,
      rows: sheet.rows.filter((r) => r.id !== rowId),
    }));
  };

  const handleAddColumn = (column: Column) => {
    updateSheet(activeSheetId, (sheet) => {
      const updatedRows = sheet.rows.map((row) => ({
        ...row,
        cells: {
          ...row.cells,
          [column.id]: null,
        },
      }));
      return {
        ...sheet,
        columns: [...sheet.columns, column],
        rows: updatedRows,
      };
    });
  };

  const handleDeleteColumn = (columnId: string) => {
    updateSheet(activeSheetId, (sheet) => {
      const updatedRows = sheet.rows.map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [columnId]: removed, ...remainingCells } = row.cells;
        return {
          ...row,
          cells: remainingCells,
        };
      });
      return {
        ...sheet,
        columns: sheet.columns.filter((c) => c.id !== columnId),
        rows: updatedRows,
      };
    });
  };

  const handleUpdateColumnName = (columnId: string, newName: string) => {
    updateSheet(activeSheetId, (sheet) => ({
      ...sheet,
      columns: sheet.columns.map((col) =>
        col.id === columnId ? { ...col, label: newName } : col,
      ),
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] rounded-lg shadow-[var(--elevation-1)] border border-[var(--outline-variant)]">
      {/* Sheet tabs */}
      {multiSheet && (
        <SheetTabs
          sheets={sheets}
          activeSheetId={activeSheetId}
          onSelectSheet={setActiveSheet}
          onAddSheet={() => addSheet(initialColumns)}
          onDeleteSheet={removeSheet}
          onUpdateSheetName={updateSheetName}
          onResetSheet={resetSheet}
        />
      )}

      {/* Sheet table */}
      <div className="flex-1 overflow-auto p-4">
        <SheetTable
          sheet={activeSheet}
          onCellChange={handleCellChange}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          onAddColumn={handleAddColumn}
          onDeleteColumn={handleDeleteColumn}
          onUpdateColumnName={handleUpdateColumnName}
        />
      </div>
    </div>
  );
}
