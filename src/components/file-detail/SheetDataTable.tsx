"use client";

import { useState } from "react";
import { Pagination } from "@/components/table/Pagination";
import { useSheetRows } from "@/hooks/queries/useFiles";
import type { SheetColumn } from "@/types/api";

const ROWS_PER_PAGE = 50; // Increased default for server-side

export interface SheetDataTableProps {
    fileId: string;
    sheetId: string;
    columns: SheetColumn[];
    initialTotalRows: number;
}

/**
 * SheetDataTable — M3 flat read-only table with server-side pagination
 */
export function SheetDataTable({
    fileId,
    sheetId,
    columns,
    initialTotalRows,
}: SheetDataTableProps) {
    const [page, setPage] = useState(1);

    const { data: rowsData, isLoading } = useSheetRows(fileId, sheetId, {
        page,
        pageSize: ROWS_PER_PAGE,
    });

    const rows = rowsData?.rows ?? [];
    const totalRows = rowsData?.total ?? initialTotalRows;
    const totalPages = Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE));

    if (columns.length === 0) {
        return (
            <p className="text-textSecondary text-sm py-6 text-center">
                This sheet has no columns defined.
            </p>
        );
    }

    return (
        <div>
            {/* Scrollable table */}
            <div className="overflow-x-auto border border-border rounded-xl bg-surface shadow-sm min-h-[200px] relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-surface/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                <table className="min-w-full divide-y divide-border text-sm">
                    <thead>
                        <tr className="bg-surface">
                            <th className="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider w-12">
                                #
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className="px-4 py-3 text-left text-[11px] font-bold text-textSecondary uppercase tracking-wider whitespace-nowrap"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-surface divide-y divide-border">
                        {rows.map((row, idx) => (
                            <tr
                                key={row.id}
                                className="hover:bg-primary-soft/10 hover:text-primary transition-all duration-150 group"
                            >
                                <td className="px-4 py-2.5 text-textSecondary text-xs font-medium bg-transparent">
                                    {(page - 1) * ROWS_PER_PAGE + idx + 1}
                                </td>
                                {columns.map((col) => (
                                    <td
                                        key={col.id}
                                        className="px-4 py-2.5 text-textPrimary whitespace-nowrap font-medium"
                                    >
                                        {row.cells[col.id] !== null &&
                                            row.cells[col.id] !== undefined
                                            ? String(row.cells[col.id])
                                            : <span className="text-border">—</span>}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="px-3 py-6 text-center text-textSecondary"
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
                        <p className="text-sm text-textSecondary">
                            Showing{" "}
                            <span className="font-medium text-textPrimary">
                                {(page - 1) * ROWS_PER_PAGE + 1}
                            </span>
                            –
                            <span className="font-medium text-textPrimary">
                                {Math.min(page * ROWS_PER_PAGE, totalRows)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-textPrimary">{totalRows}</span>{" "}
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
