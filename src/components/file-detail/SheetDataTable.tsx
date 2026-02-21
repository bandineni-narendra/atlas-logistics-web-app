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
            <div className="overflow-x-auto border border-[var(--outline-variant)] rounded-xl bg-[var(--surface)] shadow-sm">
                <table className="min-w-full divide-y divide-[var(--outline-variant)] text-sm">
                    <thead>
                        <tr className="bg-[var(--surface-container-low)]">
                            <th className="px-4 py-3 text-left text-[11px] font-bold text-[var(--on-surface-variant)] uppercase tracking-wider w-12">
                                #
                            </th>
                            {columns.map((col, idx) => (
                                <th
                                    key={col.id}
                                    className="px-4 py-3 text-left text-[11px] font-bold text-[var(--on-surface-variant)] uppercase tracking-wider whitespace-nowrap"
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
                                className="hover:bg-[var(--primary-container)]/10 hover:text-[var(--primary)] transition-all duration-150 group"
                            >
                                <td className="px-4 py-2.5 text-[var(--on-surface-variant)] text-xs font-medium bg-transparent">
                                    {(page - 1) * ROWS_PER_PAGE + idx + 1}
                                </td>
                                {columns.map((col, cIdx) => (
                                    <td
                                        key={col.id}
                                        className="px-4 py-2.5 text-[var(--on-surface)] whitespace-nowrap font-medium"
                                    >
                                        {row.cells[col.id] !== null &&
                                            row.cells[col.id] !== undefined
                                            ? String(row.cells[col.id])
                                            : <span className="text-[var(--outline-variant)]">—</span>}
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
