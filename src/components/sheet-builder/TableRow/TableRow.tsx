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
    <tr className="group hover:bg-[var(--surface-container-low)] transition-all duration-200">
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
        className="border-b border-[var(--outline-variant)] bg-[var(--surface)] group-hover:bg-[var(--surface-container-low)] px-2 py-0 transition-all duration-200"
        style={{ width: "80px", minWidth: "80px" }}
      >
        <div className="flex items-center justify-center gap-1 h-8 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
          {/* Copy button */}
          <button
            onClick={onCopy}
            className="p-1.5 text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--primary-container)] rounded-md transition-all duration-200 hover:scale-110"
            title={t("rows.copy") || "Copy row"}
            type="button"
            aria-label={`Copy row ${rowIndex + 1}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
              />
            </svg>
          </button>

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="p-1.5 text-[var(--on-surface-variant)] hover:text-[var(--error)] hover:bg-[var(--error-container)] rounded-md transition-all duration-200 hover:scale-110"
            title={t("columns.delete")}
            type="button"
            aria-label={`Delete row ${rowIndex + 1}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </td>

      {/* Empty cell for Add Column header alignment */}
      <td
        className="border-b border-[var(--outline-variant)] bg-[var(--surface)]"
        style={{ minWidth: "100px" }}
      ></td>
    </tr>
  );
}
