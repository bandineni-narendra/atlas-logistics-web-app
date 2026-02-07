/**
 * Memoized Table Cell Wrapper
 * 
 * Prevents unnecessary re-renders by memoizing the onChange handler
 */

"use client";

import { memo, useCallback } from "react";
import { Column, CellValue } from "@/core/sheet-builder";
import { TableCell } from "../TableCell";

interface MemoizedTableCellProps {
  column: Column;
  value: CellValue;
  columnId: string;
  onCellChange: (columnId: string, value: CellValue) => void;
}

export const MemoizedTableCell = memo(function MemoizedTableCell({
  column,
  value,
  columnId,
  onCellChange,
}: MemoizedTableCellProps) {
  const handleChange = useCallback(
    (newValue: CellValue) => {
      onCellChange(columnId, newValue);
    },
    [columnId, onCellChange]
  );

  return <TableCell column={column} value={value} onChange={handleChange} />;
});
