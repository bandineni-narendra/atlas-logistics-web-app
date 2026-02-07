/**
 * Core Sheet Builder - Sheet Table
 *
 * Material 3 inspired spreadsheet with clean grid and contextual actions.
 */

"use client";

import { useCallback, useMemo } from "react";
import {
  Sheet,
  Column,
  createColumn,
  CellValue,
  ColumnType,
} from "@/core/sheet-builder";
import { TableHeader } from "../TableHeader";
import { TableRow } from "../TableRow";
import { AddRowButton } from "../AddRowButton";

interface SheetTableProps {
  sheet: Sheet;
  onCellChange: (rowId: string, columnId: string, value: CellValue) => void;
  onAddRow: () => void;
  onDeleteRow: (rowId: string) => void;
  onAddColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
  onUpdateColumnName: (columnId: string, newName: string) => void;
}

export function SheetTable({
  sheet,
  onCellChange,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
  onUpdateColumnName,
}: SheetTableProps) {
  const handleAddColumn = useCallback(() => {
    const newColumnId = `col-${Date.now()}`;
    const newColumn = createColumn({
      id: newColumnId,
      label: `Column ${sheet.columns.length + 1}`,
      type: ColumnType.TEXT,
    });
    onAddColumn(newColumn);
  }, [sheet.columns.length, onAddColumn]);

  return (
    <div className="flex flex-col gap-4">
      {/* Modern minimalistic spreadsheet container */}
      <div className="overflow-auto rounded-2xl bg-white shadow-lg border border-gray-200 p-4">
        <table className="border-collapse w-full">
          <TableHeader
            columns={sheet.columns}
            onDeleteColumn={onDeleteColumn}
            onAddColumn={handleAddColumn}
            onUpdateColumnName={onUpdateColumnName}
          />
          <tbody>
            {sheet.rows.length === 0 ? (
              <tr>
                <td colSpan={sheet.columns.length + 1} className="text-center py-16">
                  <p className="text-gray-400 text-sm">Click Add row to add data</p>
                </td>
              </tr>
            ) : (
              sheet.rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  row={row}
                  columns={sheet.columns}
                  rowIndex={index}
                  onCellChange={(columnId, value) =>
                    onCellChange(row.id, columnId, value)
                  }
                  onDelete={() => onDeleteRow(row.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Contextual action buttons */}
      <div className="flex items-center gap-3">
        <AddRowButton onAdd={onAddRow} />
      </div>
    </div>
  );
}
