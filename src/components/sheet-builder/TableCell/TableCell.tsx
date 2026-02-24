/**
 * Core Sheet Builder - Table Cell
 *
 * Generic editable cell component.
 * Material 3 inspired design with high contrast text.
 */

"use client";

import { useCallback, memo } from "react";
import { ColumnType, CellValue, Column } from "@/core/sheet-builder";

// Modern minimalistic input styles
const BASE_INPUT_CLASSES = `
  w-full h-full px-2 py-1.5
  text-xs font-normal text-textPrimary
  placeholder:text-textSecondary
  bg-transparent
  border-0 outline-none
  focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none
  cursor-text
`;

interface TableCellProps {
  column: Column;
  value: CellValue;
  onChange: (value: CellValue) => void;
}

export const TableCell = memo(function TableCell({
  column,
  value,
  onChange,
}: TableCellProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const newValue = e.target.value;

      if (column.type === ColumnType.NUMBER) {
        onChange(newValue === "" ? null : parseFloat(newValue));
      } else if (column.type === ColumnType.BOOLEAN) {
        onChange((e.target as HTMLInputElement).checked);
      } else {
        onChange(newValue || null);
      }
    },
    [column.type, onChange],
  );

  const columnWidth = column.width || 150;

  const renderInput = () => {
    switch (column.type) {
      case ColumnType.NUMBER:
        return (
          <input
            type="number"
            value={value !== null && typeof value === "number" ? value : ""}
            onChange={handleChange}
            placeholder={column.placeholder}
            className={BASE_INPUT_CLASSES}
          />
        );

      case ColumnType.DATE:
        return (
          <input
            type="date"
            value={value !== null ? String(value) : ""}
            onChange={handleChange}
            className={`${BASE_INPUT_CLASSES} [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
          />
        );

      case ColumnType.SELECT:
        return (
          <select
            value={value !== null ? String(value) : ""}
            onChange={handleChange}
            className={`${BASE_INPUT_CLASSES} cursor-pointer appearance-none bg-right bg-no-repeat pr-8`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.25rem 1.25rem",
            }}
          >
            <option value="" className="text-textSecondary">
              Select...
            </option>
            {column.options?.map((opt, i) => {
              const optVal = typeof opt === 'string' ? opt : (opt.value || opt.label);
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <option
                  key={`${optVal}-${i}`}
                  value={optVal}
                  className="text-textPrimary bg-surface"
                >
                  {optLabel}
                </option>
              );
            })}
          </select>
        );

      case ColumnType.BOOLEAN:
        return (
          <div className="flex items-center justify-center h-full">
            <input
              type="checkbox"
              checked={!!value}
              onChange={handleChange}
              className="w-5 h-5 text-primary bg-surface border-border rounded cursor-pointer focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-200 hover:scale-110"
            />
          </div>
        );

      case ColumnType.TEXT:
      default:
        return (
          <input
            type="text"
            value={value !== null ? String(value) : ""}
            onChange={handleChange}
            placeholder={column.placeholder}
            className={BASE_INPUT_CLASSES}
          />
        );
    }
  };

  return (
    <td
      className="relative border-r border-b border-border bg-surface hover:bg-surface outline-none focus-within:bg-surface focus-within:shadow-md focus-within:border-primary focus-within:z-10"
      style={{
        width: `${columnWidth}px`,
        transition:
          "background-color 200ms, box-shadow 200ms, border-color 200ms",
      }}
    >
      <div className="relative h-8">{renderInput()}</div>
    </td>
  );
});
