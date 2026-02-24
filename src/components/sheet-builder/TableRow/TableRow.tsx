/**
 * Core Sheet Builder - Table Row
 *
 * Material 3 inspired row with subtle hover states and end-positioned actions.
 */

"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Row as RowModel, Column, CellValue } from "@/core/sheet-builder";
import { TableCell } from "../TableCell";
import { Copy, Trash2 } from "lucide-react";

interface TableRowProps {
  row: RowModel;
  columns: Column[];
  rowIndex: number;
  onCellChange: (columnId: string, value: CellValue) => void;
  onDelete: () => void;
  onCopy: () => void;
}

export function TableRow({
  row,
  columns,
  rowIndex,
  onCellChange,
  onDelete,
  onCopy,
}: TableRowProps) {
  const t = useTranslations("sheetBuilder");

  return (
    <tr className="group hover:bg-surface transition-all duration-200">
      {/* Data cells */}
      {columns.map((column) => (
        <TableCell
          key={column.id}
          column={column}
          value={row.cells[column.id]}
          onChange={(val) => onCellChange(column.id, val)}
        />
      ))}

      {/* Row actions: Copy & Delete */}
      <td
        className="border-b border-border bg-surface group-hover:bg-surface px-2 py-0 transition-all duration-200"
        style={{ width: "80px", minWidth: "80px" }}
      >
        <div className="flex items-center justify-center gap-1 h-8 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
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
        className="border-b border-border bg-surface"
        style={{ minWidth: "100px" }}
      ></td>
    </tr>
  );
}
