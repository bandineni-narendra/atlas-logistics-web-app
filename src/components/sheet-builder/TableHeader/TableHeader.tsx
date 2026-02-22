/**
 * Core Sheet Builder - Table Header
 *
 * Material 3 inspired header with clean typography and subtle actions.
 */

"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Column } from "@/core/sheet-builder";
import { X, Plus } from "lucide-react";

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
  const t = useTranslations("sheetBuilder");
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const startEditing = useCallback((column: Column) => {
    setEditingColumnId(column.id);
    setEditingValue(column.label);
  }, []);

  const saveEdit = useCallback(
    (columnId: string) => {
      if (editingValue.trim()) {
        onUpdateColumnName(columnId, editingValue.trim());
      }
      setEditingColumnId(null);
      setEditingValue("");
    },
    [editingValue, onUpdateColumnName],
  );

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
              className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] border-r border-[var(--outline-variant)] px-2 py-2 text-left group relative hover:bg-[var(--surface-container-high)] transition-all duration-200"
              style={{
                width: `${columnWidth}px`,
              }}
            >
              <div className="pr-8 flex items-center gap-1 w-full h-full">
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
                    spellCheck={false}
                    className="text-sm bg-[var(--surface-container-lowest)] border border-[var(--primary)] text-[var(--on-surface)] rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-[var(--primary)] min-w-[120px] w-full shadow-sm"
                  />
                ) : (
                  <>
                    <span
                      onClick={() => startEditing(column)}
                      className="text-[10px] font-bold text-[var(--on-surface)] cursor-pointer hover:text-[var(--primary)] transition-all duration-200 block flex-1 whitespace-pre-line overflow-hidden text-ellipsis leading-tight py-1"
                      title={column.label}
                    >
                      {column.label}
                    </span>
                    {column.required && (
                      <span
                        className="text-[var(--error)] text-xs font-bold flex-shrink-0"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-[var(--on-surface-variant)] hover:text-[var(--error)] hover:bg-[var(--error-container)] rounded-md p-1.5 transition-all duration-200 hover:scale-110"
                title={t("columns.delete")}
                type="button"
                aria-label={`Delete ${column.label} column`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </th>
          );
        })}

        {/* Delete row column header */}
        <th
          className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-2 py-2 text-center"
          style={{ width: "80px", minWidth: "80px" }}
        >
          <span className="text-xs font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider">
            {t("columns.actions")}
          </span>
        </th>

        {/* Add Column button */}
        <th
          className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)] px-2 py-2"
          style={{ minWidth: "100px" }}
        >
          <button
            onClick={onAddColumn}
            className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-[var(--on-primary)] hover:text-[var(--on-primary)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-md transition-all duration-200 group w-full justify-center border border-transparent"
            title="Add column"
            type="button"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--on-primary)] transition-all duration-200 group-hover:rotate-90" />
            <span>{t("columns.name")}</span>
          </button>
        </th>
      </tr>
    </thead>
  );
}
