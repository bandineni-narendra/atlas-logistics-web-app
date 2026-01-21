"use client";

import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { Pagination } from "./Pagination";
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
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(totalItems / pageSize);

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
