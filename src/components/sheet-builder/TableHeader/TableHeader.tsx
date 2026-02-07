/**
 * Core Sheet Builder - Table Header
 *
 * Material 3 inspired header with clean typography and subtle actions.
 */

"use client";

import { useState, useCallback } from "react";
import { Column } from "@/core/sheet-builder";

interface TableHeaderProps {
  columns: Column[];
  onDeleteColumn: (columnId: string) => void;
  onAddColumn: () => void;
  onUpdateColumnName: (columnId: string, newName: string) => void;
}

export function TableHeader({
  columns,
  onDeleteColumn,
  onAddColumn,
  onUpdateColumnName,
}: TableHeaderProps) {
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const startEditing = useCallback((column: Column) => {
    setEditingColumnId(column.id);
    setEditingValue(column.label);
  }, []);

  const saveEdit = useCallback((columnId: string) => {
    if (editingValue.trim()) {
      onUpdateColumnName(columnId, editingValue.trim());
    }
    setEditingColumnId(null);
    setEditingValue("");
  }, [editingValue, onUpdateColumnName]);

  const cancelEdit = useCallback(() => {
    setEditingColumnId(null);
    setEditingValue("");
  }, []);

  return (
    <thead className="sticky top-0 z-10">
      <tr>
        {/* Data column headers */}
        {columns.map((column) => {
          const columnWidth = column.width || 150;
          return (
            <th
              key={column.id}
              className="bg-gray-50 border-b border-gray-200 border-r border-gray-100 px-2 py-2 text-left group relative hover:bg-gray-100 transition-all duration-200"
              style={{
                minWidth: `${Math.max(columnWidth * 0.7, 100)}px`,
              }}
            >
              <div className="pr-8 flex items-center gap-1">
                {editingColumnId === column.id ? (
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => saveEdit(column.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveEdit(column.id);
                      } else if (e.key === "Escape") {
                        cancelEdit();
                      }
                    }}
                    autoFocus
                    className="text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 shadow-sm w-full"
                  />
                ) : (
                  <>
                    <span
                      onClick={() => startEditing(column)}
                      className="text-xs font-semibold text-gray-800 cursor-pointer hover:text-gray-900 transition-all duration-200 block flex-1 whitespace-nowrap"
                      title={column.label}
                    >
                      {column.label}
                    </span>
                    {column.required && (
                      <span
                        className="text-red-500 text-xs font-bold flex-shrink-0"
                        title="Required"
                      >
                        *
                      </span>
                    )}
                  </>
                )}
              </div>
              <button
                onClick={() => onDeleteColumn(column.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md p-1.5 transition-all duration-200 hover:scale-110"
                title="Delete column"
                type="button"
                aria-label={`Delete ${column.label} column`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </th>
          );
        })}

        {/* Delete row column header */}
        <th
          className="bg-gray-50 border-b border-gray-200 px-2 py-2 text-center"
          style={{ width: "70px", minWidth: "70px" }}
        >
          <span className="text-xs font-semibold text-gray-600">
            Delete
          </span>
        </th>

        {/* Add Column button */}
        <th
          className="bg-gray-50 border-b border-gray-200 px-2 py-2"
          style={{ minWidth: "100px" }}
        >
          <button
            onClick={onAddColumn}
            className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-white hover:text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200 group w-full justify-center border border-blue-700 hover:border-blue-800"
            title="Add column"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 text-white transition-all duration-200 group-hover:rotate-90"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>Column</span>
          </button>
        </th>
      </tr>
    </thead>
  );
}
