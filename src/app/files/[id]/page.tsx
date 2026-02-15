"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFileDetail, useFileSheets } from "@/hooks/queries/useFiles";
import { SheetTabs, SheetDataTable } from "@/components/file-detail";

/**
 * File Detail Page
 * Route: /files/:id
 *
 * 1. Fetches file metadata + sheet summaries (useFileDetail)
 * 2. Fetches all sheets with full data (useFileSheets)
 * 3. Displays sheet tabs → active sheet data in a read-only, paginated table
 */
export default function FileDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const fileId = params.id;

    const { data: detailData, isLoading: detailLoading, isError: detailError } =
        useFileDetail(fileId);
    const { data: sheetsData, isLoading: sheetsLoading, isError: sheetsError } =
        useFileSheets(fileId);

    const [activeSheetId, setActiveSheetId] = useState<string>("");

    // Set the first sheet as active once data arrives
    useEffect(() => {
        if (sheetsData?.sheets?.length && !activeSheetId) {
            setActiveSheetId(sheetsData.sheets[0].id);
        }
    }, [sheetsData, activeSheetId]);

    const file = detailData?.file;
    const sheets = sheetsData?.sheets ?? [];
    const activeSheet = sheets.find((s) => s.id === activeSheetId);

    // --- Loading ---
    if (detailLoading || sheetsLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[var(--on-surface-variant)] text-sm">Loading file…</p>
                </div>
            </div>
        );
    }

    // --- Error ---
    if (detailError || sheetsError || !file) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[var(--error)] font-medium mb-2">
                        Failed to load file details
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium"
                    >
                        ← Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium mb-3 inline-flex items-center gap-1"
                >
                    ← Back
                </button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--on-surface)]">
                            {file.name}
                        </h1>
                        <div className="mt-1 flex items-center gap-3 text-sm text-[var(--on-surface-variant)]">
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${file.type === "OCEAN"
                                    ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                                    : "bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]"
                                    }`}
                            >
                                {file.type}
                            </span>
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${file.status === "saved"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : file.status === "draft"
                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                        : "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]"
                                    }`}
                            >
                                {file.status}
                            </span>
                            <span>Effective: {file.effectiveDate}</span>
                            <span>{sheets.length} sheet(s)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sheet Tabs */}
            {sheets.length > 0 ? (
                <div className="bg-[var(--surface)] rounded-xl border border-[var(--outline-variant)] shadow-[var(--elevation-1)] overflow-hidden">
                    <SheetTabs
                        sheets={sheets.map((s) => ({ id: s.id, name: s.name }))}
                        activeSheetId={activeSheetId}
                        onTabChange={setActiveSheetId}
                    />

                    {/* Active Sheet Data Table */}
                    <div className="p-4">
                        {activeSheet ? (
                            <SheetDataTable data={activeSheet.data} />
                        ) : (
                            <p className="text-[var(--on-surface-variant)] text-sm text-center py-6">
                                Select a sheet tab above.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-[var(--surface)] rounded-xl border border-[var(--outline-variant)] p-8 text-center">
                    <p className="text-[var(--on-surface-variant)]">
                        This file has no sheets.
                    </p>
                </div>
            )}
        </div>
    );
}
