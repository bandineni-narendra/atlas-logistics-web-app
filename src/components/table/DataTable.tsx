"use client";

import { useMemo } from "react";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { Pagination } from "@/components/table/Pagination";
import { TableProps } from "@/types/table";

/**
 * Generic, reusable data table component
 * Handles pagination, rendering, and layout
 * Configured per feature (e.g., ocean freight)
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  isLoading = false,
  emptyMessage = "No data available",
}: TableProps<T>) {
  const { paginatedData, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return {
      paginatedData: data.slice(startIndex, startIndex + pageSize),
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }, [data, currentPage, pageSize, totalItems]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Table */}
      <div className="w-full">
        <table className="w-full" style={{ tableLayout: "fixed" }}>
          <TableHeader columns={columns} />
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-6 text-center text-gray-500"
                >
                  {isLoading ? "Loading..." : emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  row={row}
                  columns={columns}
                  index={index}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isDisabled={isLoading}
      />
    </div>
  );
}
