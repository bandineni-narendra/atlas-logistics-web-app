/**
 * Core Sheet Builder - Table Header
 *
 * Material 3 inspired header with clean typography and subtle actions.
 */

"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { useTranslations } from "next-intl";
import { Column } from "@/core/sheet-builder";
import { X, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

  const startEditing = useCallback((column: Column) => {
    setEditingColumnId(column.id);
  }, []);

  const saveEdit = useCallback(
    (columnId: string, newValue: string) => {
      if (newValue.trim()) {
        onUpdateColumnName(columnId, newValue.trim());
      }
      setEditingColumnId(null);
    },
    [onUpdateColumnName],
  );

  const cancelEdit = useCallback(() => {
    setEditingColumnId(null);
  }, []);

  return (
    <thead className="sticky top-0 z-10">
      <tr>
        {/* Data column headers */}
        {columns.map((column) => {
          const columnWidth = column.width || 150;
          return (
            <SortableHeaderCell
              key={column.id}
              column={column}
              columnWidth={columnWidth}
              isEditing={editingColumnId === column.id}
              startEditing={startEditing}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
              onDeleteColumn={onDeleteColumn}
            />
          );
        })}

        {/* Delete row column header */}
        <th
          className="bg-surface border-b border-border px-2 py-2 text-center"
          style={{ width: "80px", minWidth: "80px" }}
        >
          <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
            {t("columns.actions")}
          </span>
        </th>

        {/* Add Column button */}
        <th
          className="bg-surface border-b border-border px-2 py-2"
          style={{ minWidth: "100px" }}
        >
          <button
            onClick={onAddColumn}
            className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-white hover:text-white bg-primary hover:bg-primary-hover rounded-md transition-all duration-200 group w-full justify-center border border-transparent"
            title="Add column"
            type="button"
          >
            <Plus className="w-3.5 h-3.5 text-white transition-all duration-200 group-hover:rotate-90" />
            <span>{t("columns.name")}</span>
          </button>
        </th>
      </tr>
    </thead>
  );
}

interface SortableHeaderCellProps {
  column: Column;
  columnWidth: number;
  isEditing: boolean;
  startEditing: (col: Column) => void;
  saveEdit: (id: string, value: string) => void;
  cancelEdit: () => void;
  onDeleteColumn: (id: string) => void;
}

export const SortableHeaderCell = memo(function SortableHeaderCell({
  column,
  columnWidth,
  isEditing,
  startEditing,
  saveEdit,
  cancelEdit,
  onDeleteColumn,
}: SortableHeaderCellProps) {
  const t = useTranslations("sheetBuilder");
  const [localValue, setLocalValue] = useState(column.label);

  useEffect(() => {
    if (isEditing) {
      setLocalValue(column.label);
    }
  }, [isEditing, column.label]);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? "none" : transition,
    width: `${columnWidth}px`,
    zIndex: isDragging ? 50 : 0,
    ...(isDragging ? {
      opacity: 0.95,
      backgroundColor: "var(--surface)",
      boxShadow: "var(--shadow-md)"
    } : {}),
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      title={isEditing ? undefined : "Press and hold to drag column"}
      className={`bg-surface border-b border-border border-r border-border px-2 py-2 text-left group relative transition-all duration-200 ${isDragging ? "cursor-grabbing" : "cursor-pointer hover:bg-surface"
        }`}
    >
      <div className="pr-8 flex items-center gap-1 w-full h-full">
        {isEditing ? (
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={() => saveEdit(column.id, localValue)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveEdit(column.id, localValue);
              } else if (e.key === "Escape") {
                setLocalValue(column.label);
                cancelEdit();
              }
            }}
            autoFocus
            spellCheck={false}
            className="text-sm bg-background border border-primary text-textPrimary rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-primary min-w-[120px] w-full shadow-sm"
          />
        ) : (
          <>
            <span
              onClick={() => startEditing(column)}
              className="text-[10px] font-bold text-textPrimary cursor-pointer hover:text-primary transition-all duration-200 block flex-1 whitespace-pre-line overflow-hidden text-ellipsis leading-tight py-1"
              title={column.label}
            >
              {column.label}
            </span>
            {column.required && (
              <span
                className="text-error text-xs font-bold flex-shrink-0"
                title="Required"
              >
                *
              </span>
            )}
          </>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteColumn(column.id);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-textSecondary hover:text-error hover:bg-error rounded-md p-1.5 transition-all duration-200 hover:scale-110"
        title={t("columns.delete") || "Delete column"}
        type="button"
        aria-label={`Delete ${column.label} column`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </th>
  );
});
