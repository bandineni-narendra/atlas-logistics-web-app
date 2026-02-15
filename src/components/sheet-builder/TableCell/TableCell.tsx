/**
 * Core Sheet Builder - Table Cell
 *
 * Generic editable cell component.
 * Material 3 inspired design with high contrast text.
 */

"use client";

import { useCallback, useMemo, memo } from "react";
import { ColumnType, CellValue, Column } from "@/core/sheet-builder";

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

  // Modern minimalistic input styles
  const baseInputClasses = useMemo(
    () => `
    w-full h-full px-2 py-1.5
    text-xs font-normal text-[var(--on-surface)]
    placeholder:text-[var(--on-surface-variant)]
    bg-transparent
    border-0 outline-none
    focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none
    cursor-text
    [color-scheme:light] dark:[color-scheme:dark]
  `,
    [],
  );

  const columnWidth = useMemo(() => column.width || 150, [column.width]);

  const renderInput = () => {
    switch (column.type) {
      case ColumnType.NUMBER:
        return (
          <input
            type="number"
            value={value !== null && typeof value === "number" ? value : ""}
            onChange={handleChange}
            placeholder={column.placeholder}
            className={baseInputClasses}
          />
        );

      case ColumnType.DATE:
        return (
          <input
            type="date"
            value={value !== null ? String(value) : ""}
            onChange={handleChange}
            className={`${baseInputClasses} [&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:invert`}
          />
        );

      case ColumnType.SELECT:
        return (
          <select
            value={value !== null ? String(value) : ""}
            onChange={handleChange}
            className={`${baseInputClasses} cursor-pointer appearance-none bg-right bg-no-repeat pr-8`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.25rem 1.25rem",
            }}
          >
            <option value="" className="text-[var(--on-surface-variant)]">
              Select...
            </option>
            {column.options?.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="text-[var(--on-surface)] bg-[var(--surface)]"
              >
                {opt.label}
              </option>
            ))}
          </select>
        );

      case ColumnType.BOOLEAN:
        return (
          <div className="flex items-center justify-center h-full">
            <input
              type="checkbox"
              checked={!!value}
              onChange={handleChange}
              className="w-5 h-5 text-[var(--primary)] bg-[var(--surface)] border-[var(--outline)] rounded cursor-pointer focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-0 transition-all duration-200 hover:scale-110"
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
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <td
      className="relative border-r border-b border-[var(--outline-variant)] bg-[var(--surface)] hover:bg-[var(--surface-container-low)] outline-none focus-within:bg-[var(--surface-container-low)] focus-within:shadow-md focus-within:border-[var(--primary)] focus-within:z-10"
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
