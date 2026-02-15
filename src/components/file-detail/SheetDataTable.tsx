"use client";

import { useMemo, useState } from "react";
import { Pagination } from "@/components/table/Pagination";
import type { SheetData } from "@/types/api";

const ROWS_PER_PAGE = 25;

export interface SheetDataTableProps {
    data: SheetData;
}

/**
 * SheetDataTable — M3 flat read-only table with client-side pagination
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
            <p className="text-[var(--on-surface-variant)] text-sm py-6 text-center">
                This sheet has no columns defined.
            </p>
        );
    }

    return (
        <div>
            {/* Scrollable table */}
            <div className="overflow-x-auto border border-[var(--outline-variant)] rounded-xl">
                <table className="min-w-full divide-y divide-[var(--outline-variant)] text-sm">
                    <thead className="bg-[var(--surface-container-low)]">
                        <tr>
                            <th className="px-3 py-2.5 text-left text-xs font-medium text-[var(--on-surface-variant)] w-12">
                                #
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className="px-3 py-2.5 text-left text-xs font-medium text-[var(--on-surface-variant)] whitespace-nowrap"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-[var(--surface)] divide-y divide-[var(--outline-variant)]">
                        {visibleRows.map((row, idx) => (
                            <tr
                                key={row.id}
                                className="hover:bg-[var(--surface-container-low)] transition-colors duration-100"
                            >
                                <td className="px-3 py-2 text-[var(--on-surface-variant)] text-xs">
                                    {(page - 1) * ROWS_PER_PAGE + idx + 1}
                                </td>
                                {columns.map((col) => (
                                    <td
                                        key={col.id}
                                        className="px-3 py-2 text-[var(--on-surface)] whitespace-nowrap"
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
                                    className="px-3 py-6 text-center text-[var(--on-surface-variant)]"
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
                        <p className="text-sm text-[var(--on-surface-variant)]">
                            Showing{" "}
                            <span className="font-medium text-[var(--on-surface)]">
                                {(page - 1) * ROWS_PER_PAGE + 1}
                            </span>
                            –
                            <span className="font-medium text-[var(--on-surface)]">
                                {Math.min(page * ROWS_PER_PAGE, totalRows)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-[var(--on-surface)]">{totalRows}</span>{" "}
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
