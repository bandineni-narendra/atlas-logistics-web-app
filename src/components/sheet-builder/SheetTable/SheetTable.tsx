/**
 * Core Sheet Builder - Sheet Table
 *
 * Material 3 inspired spreadsheet with clean grid and contextual actions.
 */

"use client";

import { useCallback, useMemo } from "react";
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
  const handleAddColumn = useCallback(() => {
    const newColumnId = `col-${Date.now()}`;
    const newColumn = createColumn({
      id: newColumnId,
      label: `Column ${sheet.columns.length + 1}`,
      type: ColumnType.TEXT,
      width: 150, // Default width for new columns
    });
    onAddColumn(newColumn);
  }, [sheet.columns.length, onAddColumn]);

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

  const columnIds = useMemo(() => sheet.columns.map((col) => col.id), [sheet.columns]);

  return (
    <div className="flex flex-col gap-4">
      {/* Modern minimalistic spreadsheet container */}
      <div className="overflow-x-auto rounded-2xl bg-surface shadow-md border border-border p-4 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="border-collapse w-full">
            <SortableContext
              items={columnIds}
              strategy={horizontalListSortingStrategy}
            >
              <TableHeader
                columns={sheet.columns}
                onDeleteColumn={onDeleteColumn}
                onAddColumn={handleAddColumn}
                onUpdateColumnName={onUpdateColumnName}
              />
            </SortableContext>
            <tbody>
              {sheet.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={sheet.columns.length + 1}
                    className="text-center py-16"
                  >
                    <p className="text-textSecondary text-sm">
                      Click Add row to add data
                    </p>
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
                    onCopy={() => onCopyRow(row.id)}
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
