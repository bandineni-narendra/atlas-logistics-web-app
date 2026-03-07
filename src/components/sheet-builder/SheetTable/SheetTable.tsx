/**
 * Core Sheet Builder - Sheet Table
 *
 * Material 3 inspired spreadsheet with clean grid and contextual actions.
 * Extended with Excel-like keyboard navigation and selection model.
 */

"use client";

import { useCallback, useMemo, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
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
import { useSpreadsheetSelection } from "@/hooks/sheet-builder/useSpreadsheetSelection";
import { useKeyboardShortcuts } from "@/hooks/sheet-builder/useKeyboardShortcuts";

interface SheetTableProps {
  sheet: Sheet;
  onCellChange: (rowId: string, columnId: string, value: CellValue) => void;
  onAddRow: () => void;
  onDeleteRow: (rowId: string) => void;
  onAddColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
  onUpdateColumnName: (columnId: string, newName: string) => void;
  onCopyRow: (rowId: string) => void;
  onReorderColumn: (oldIndex: number, newIndex: number) => void;
}

export function SheetTable({
  sheet,
  onCellChange,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
  onUpdateColumnName,
  onCopyRow,
  onReorderColumn,
}: SheetTableProps) {
  // ─── Container ref for keyboard scope ───────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Spreadsheet selection / active-cell state ────────────────────
  const {
    activeCell,
    selection,
    setActiveCell,
    moveActiveCell,
    selectRow,
    selectColumn,
    isCellSelected,
    isCellActive,
  } = useSpreadsheetSelection();

  // ─── Programmatic focus helper ────────────────────────────────────
  const focusCell = useCallback(
    (rowIndex: number, columnIndex: number) => {
      if (!containerRef.current) return;
      const td = containerRef.current.querySelector<HTMLElement>(
        `[data-row-index="${rowIndex}"][data-col-index="${columnIndex}"]`
      );
      const input = td?.querySelector<HTMLElement>("input, select, textarea, [role='combobox']");
      input?.focus();
    },
    []
  );

  // ─── Keyboard shortcuts ───────────────────────────────────────────
  useKeyboardShortcuts({
    containerRef,
    sheet,
    activeCell,
    selection,
    onMoveActiveCell: moveActiveCell,
    onSelectRow: selectRow,
    onSelectColumn: selectColumn,
    onCellChange,
    onAddRow,
    onDeleteRow,
    onAddColumn,
    onDeleteColumn,
    onCopyRow,
    focusCell,
  });

  // ─── Add column helper ────────────────────────────────────────────
  const handleAddColumn = useCallback(() => {
    const newColumnId = `col-${Date.now()}`;
    const newColumn = createColumn({
      id: newColumnId,
      label: `Column ${sheet.columns.length + 1}`,
      type: ColumnType.TEXT,
      width: 150,
    });
    onAddColumn(newColumn);
  }, [sheet.columns.length, onAddColumn]);

  // ─── DnD column reorder ───────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = sheet.columns.findIndex((col) => col.id === active.id);
        const newIndex = sheet.columns.findIndex((col) => col.id === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          onReorderColumn(oldIndex, newIndex);
        }
      }
    },
    [onReorderColumn, sheet.columns]
  );

  const handleFillDown = useCallback(
    (sourceRowIndex: number, columnId: string) => {
      const sourceRow = sheet.rows[sourceRowIndex];
      if (!sourceRow) return;
      const sourceValue = sourceRow.cells[columnId] ?? null;

      // Fill all rows below (or range if selection spans multiple rows)
      const startRow = sourceRowIndex + 1;
      const endRow =
        selection && selection.type === "range"
          ? selection.endRow
          : sheet.rows.length - 1;

      for (let r = startRow; r <= endRow; r++) {
        const row = sheet.rows[r];
        if (!row) continue;
        onCellChange(row.id, columnId, sourceValue);
      }
    },
    [sheet.rows, selection, onCellChange]
  );

  const columnIds = useMemo(() => sheet.columns.map((col) => col.id), [sheet.columns]);

  return (
    <div className="flex flex-col gap-4">
      {/* Modern minimalistic spreadsheet container */}
      <div
        ref={containerRef}
        className="w-full max-w-full overflow-x-auto rounded-2xl bg-surface shadow-md border border-border p-4"
        /* tabIndex so focus events bubble from child inputs into this div */
        tabIndex={-1}
        style={{ outline: "none" }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table
            className="border-collapse border-spacing-0 sheet-table"
            style={{ width: "100%" }}
          >
            <SortableContext
              items={columnIds}
              strategy={horizontalListSortingStrategy}
            >
              <TableHeader
                columns={sheet.columns}
                onDeleteColumn={onDeleteColumn}
                onAddColumn={handleAddColumn}
                onUpdateColumnName={onUpdateColumnName}
                activeColumnIndex={activeCell?.columnIndex ?? null}
                selection={selection}
              />
            </SortableContext>
            <tbody>
              {sheet.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={sheet.columns.length + 3}
                    className="text-center py-16"
                  >
                    <p className="text-textSecondary text-sm px-4 py-2">
                      Click Add row to add data
                    </p>
                  </td>
                </tr>
              ) : (
                sheet.rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    columns={sheet.columns}
                    rowIndex={rowIndex}
                    onCellChange={(columnId, value) =>
                      onCellChange(row.id, columnId, value)
                    }
                    onDelete={() => onDeleteRow(row.id)}
                    onCopy={() => onCopyRow(row.id)}
                    onFillDown={(columnId) => handleFillDown(rowIndex, columnId)}
                    activeColumnIndex={
                      activeCell?.rowIndex === rowIndex
                        ? activeCell.columnIndex
                        : null
                    }
                    selection={selection}
                    onCellFocus={setActiveCell}
                  />
                ))
              )}
            </tbody>
          </table>
        </DndContext>
      </div>

      {/* Contextual action buttons */}
      <div className="flex items-center gap-3">
        <AddRowButton onAdd={onAddRow} />
      </div>
    </div>
  );
}

// EOF - SheetTable
