"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { Pagination } from "@/components/table/Pagination";
import { TableProps } from "@/types/table";
import { EmptyState, LoadingState } from "@/components/ui";

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
  onCellChange,
  isLoading = false,
  emptyMessage,
}: TableProps<T>) {
  const t = useTranslations();
  const displayEmptyMessage = emptyMessage ?? t("table.noDataAvailable");

  const { paginatedData, totalPages, startIndex } = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return {
      paginatedData: data.slice(startIndex, startIndex + pageSize),
      totalPages: Math.ceil(totalItems / pageSize),
      startIndex,
    };
  }, [data, currentPage, pageSize, totalItems]);

  return (
    <div className="overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: "1200px" }}>
          <TableHeader columns={columns} />
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>
                  <LoadingState />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    icon="📋"
                    title={displayEmptyMessage}
                    description="Upload a file to see data here"
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  row={row}
                  columns={columns}
                  index={index}
                  rowIndex={startIndex + index}
                  onCellChange={onCellChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isDisabled={isLoading}
        />
      )}
    </div>
  );
}
