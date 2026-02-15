"use client";

import { useMemo, useState } from "react";
import { Pagination } from "@/components/table/Pagination";
import type { SheetData } from "@/types/api";

const ROWS_PER_PAGE = 25;

export interface SheetDataTableProps {
    data: SheetData;
}

/**
 * SheetDataTable — read-only table with client-side pagination.
 * Renders column headers from data.columns and rows from data.rows.
 */
export function SheetDataTable({ data }: SheetDataTableProps) {
    const [page, setPage] = useState(1);

    const { columns, rows } = data;
    const totalRows = rows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE));

    // Paginate rows on the client
    const visibleRows = useMemo(() => {
        const start = (page - 1) * ROWS_PER_PAGE;
        return rows.slice(start, start + ROWS_PER_PAGE);
    }, [rows, page]);

    if (columns.length === 0) {
        return (
            <p className="text-gray-500 text-sm py-6 text-center">
                This sheet has no columns defined.
            </p>
        );
    }

    return (
        <div>
            {/* Scrollable table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                                #
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {visibleRows.map((row, idx) => (
                            <tr
                                key={row.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-3 py-2 text-gray-400 text-xs">
                                    {(page - 1) * ROWS_PER_PAGE + idx + 1}
                                </td>
                                {columns.map((col) => (
                                    <td
                                        key={col.id}
                                        className="px-3 py-2 text-gray-700 whitespace-nowrap"
                                    >
                                        {row.cells[col.id] !== null &&
                                            row.cells[col.id] !== undefined
                                            ? String(row.cells[col.id])
                                            : "—"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {visibleRows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="px-3 py-6 text-center text-gray-500"
                                >
                                    No rows in this sheet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Row count + pagination */}
            {totalRows > 0 && (
                <div className="mt-3">
                    <div className="px-4 py-1">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium text-gray-900">
                                {(page - 1) * ROWS_PER_PAGE + 1}
                            </span>
                            –
                            <span className="font-medium text-gray-900">
                                {Math.min(page * ROWS_PER_PAGE, totalRows)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-gray-900">{totalRows}</span>{" "}
                            rows
                        </p>
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
}
