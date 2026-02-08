/**
 * Core Sheet Builder - Table Row
 *
 * Material 3 inspired row with subtle hover states and end-positioned actions.
 */

"use client";

import { memo, useCallback } from "react";
import { Row as RowModel, Column, CellValue } from "@/core/sheet-builder";
import { MemoizedTableCell } from "./MemoizedTableCell";

interface TableRowProps {
  row: RowModel;
  columns: Column[];
  rowIndex: number;
  onCellChange: (columnId: string, value: CellValue) => void;
  onDelete: () => void;
}

export const TableRow = memo(function TableRow({
  row,
  columns,
  rowIndex,
  onCellChange,
  onDelete,
}: TableRowProps) {
  return (
    <tr className="group hover:bg-gray-50 transition-all duration-200">
      {/* Data cells */}
      {columns.map((column) => (
        <MemoizedTableCell
          key={column.id}
          column={column}
          value={row.cells[column.id]}
          columnId={column.id}
          onCellChange={onCellChange}
        />
      ))}

      {/* Delete row button */}
      <td
        className="border-b border-gray-100 bg-white hover:bg-gray-50 text-center px-2 py-0 transition-all duration-200"
        style={{ width: "70px", minWidth: "70px" }}
      >
        <div className="flex items-center justify-center h-8">
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md px-1.5 py-1 transition-all duration-200 hover:scale-105"
            title="Delete row"
            type="button"
            aria-label={`Delete row ${rowIndex + 1}`}
          >
            <span className="text-xs font-medium whitespace-nowrap">Delete</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3"
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
        className="border-b border-gray-100 bg-white"
        style={{ minWidth: "100px" }}
      ></td>
    </tr>
  );
});
