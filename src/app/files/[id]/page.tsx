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
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Loading file…</p>
                </div>
            </div>
        );
    }

    // --- Error ---
    if (detailError || sheetsError || !file) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 font-medium mb-2">
                        Failed to load file details
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-3 inline-flex items-center gap-1"
                >
                    ← Back
                </button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {file.name}
                        </h1>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${file.type === "OCEAN"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-purple-100 text-purple-700"
                                    }`}
                            >
                                {file.type}
                            </span>
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${file.status === "saved"
                                        ? "bg-green-100 text-green-700"
                                        : file.status === "draft"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-600"
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
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                            <p className="text-gray-500 text-sm text-center py-6">
                                Select a sheet tab above.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">
                        This file has no sheets.
                    </p>
                </div>
            )}
        </div>
    );
}
