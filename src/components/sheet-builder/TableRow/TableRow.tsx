/**
 * Core Sheet Builder - Table Row
 *
 * Material 3 inspired row with subtle hover states and end-positioned actions.
 * Extended with active cell and selection support.
 */

"use client";

import { useCallback, memo } from "react";
import { useTranslations } from "next-intl";
import { Row as RowModel, Column, CellValue } from "@/core/sheet-builder";
import { TableCell } from "../TableCell";
import { Copy, Trash2 } from "lucide-react";
import { Selection } from "@/hooks/sheet-builder/useSpreadsheetSelection";

interface TableRowProps {
  row: RowModel;
  columns: Column[];
  rowIndex: number;
  onCellChange: (columnId: string, value: CellValue) => void;
  onDelete: () => void;
  onCopy: () => void;
  /** Explicit fallback for Ctrl+D when standard event bubbling fails (e.g., inside Portals) */
  onFillDown: (columnId: string) => void;
  /** Index of the currently active column (or null) */
  activeColumnIndex: number | null;
  /** Current sheet-level selection to determine highlighting */
  selection: Selection | null;
  /** Notify SheetTable that a cell received focus */
  onCellFocus: (rowIndex: number, columnIndex: number) => void;
}

export const TableRow = memo(function TableRow({
  row,
  columns,
  rowIndex,
  onCellChange,
  onDelete,
  onCopy,
  onFillDown,
  activeColumnIndex,
  selection,
  onCellFocus,
}: TableRowProps) {
  const t = useTranslations("sheetBuilder");

  // Determine if this entire row is highlighted (row selection)
  const isRowSelected =
    selection?.type === "row" &&
    rowIndex >= selection.startRow &&
    rowIndex <= selection.endRow;

  return (
    <tr
      className={`group transition-all duration-200 ${isRowSelected ? "sheet-row-selected" : "hover:bg-surface"
        }`}
    >
      {/* Data cells */}
      {columns.map((column, colIndex) => {
        const isActive =
          activeColumnIndex === colIndex;
        let isSelected = false;
        if (!isActive && selection) {
          if (selection.type === "column") {
            isSelected = colIndex >= selection.startColumn && colIndex <= selection.endColumn;
          } else if (selection.type === "row") {
            isSelected = rowIndex >= selection.startRow && rowIndex <= selection.endRow;
          } else {
            // cell or range
            isSelected =
              rowIndex >= selection.startRow &&
              rowIndex <= selection.endRow &&
              colIndex >= selection.startColumn &&
              colIndex <= selection.endColumn;
          }
        }

        return (
          <TableCell
            key={column.id}
            column={column}
            value={row.cells[column.id]}
            onChange={(val) => onCellChange(column.id, val)}
            rowIndex={rowIndex}
            columnIndex={colIndex}
            isActive={isActive}
            isSelected={isSelected}
            onCellFocus={onCellFocus}
            onFillDown={() => onFillDown(column.id)}
          />
        );
      })}

      {/* Row actions: Copy & Delete */}
      <td
        data-col-type="actions"
        className="border-b border-border bg-surface group-hover:bg-surface px-2 py-0 transition-all duration-200 whitespace-nowrap"
        style={{ width: "1%" }}
      >
        <div className="flex items-center justify-center gap-1 h-9 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
          {/* Copy button */}
          <button
            onClick={onCopy}
            className="p-1.5 text-textSecondary hover:text-primary hover:bg-primary-soft rounded-md transition-all duration-200 hover:scale-110"
            title={t("rows.copy") || "Copy row"}
            type="button"
            aria-label={`Copy row ${rowIndex + 1}`}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="p-1.5 text-textSecondary hover:text-white hover:bg-error rounded-md transition-all duration-200 hover:scale-110"
            title={t("columns.delete")}
            type="button"
            aria-label={`Delete row ${rowIndex + 1}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>

      {/* Empty cell for Add Column header alignment */}
      <td
        data-col-type="add"
        className="border-b border-border bg-surface whitespace-nowrap"
      ></td>
    </tr>
  );
});
