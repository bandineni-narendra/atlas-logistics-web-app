"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFileDetail, useFileSheets } from "@/hooks/queries/useFiles";
import { SheetTabs, SheetDataTable } from "@/components/file-detail";
import { useUI } from "@/contexts/UIContext";
import { FILE_TYPE_CONFIG, FILE_STATUS_CONFIG } from "@/constants";

/**
 * File Detail Page
 * Route: /files/:id
 */
export default function FileDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const fileId = params.id;
    const { isSidebarCollapsed } = useUI();

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
                        className="text-sm px-4 py-2 bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-highest)] text-[var(--primary)] rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                    >
                        ← Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`mx-auto px-4 py-6 transition-all duration-300 ${isSidebarCollapsed ? "max-w-[98%]" : "max-w-7xl"}`}>
            {/* Header & Back Button */}
            <div className="mb-6 flex flex-col gap-4">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="group inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[var(--on-surface-variant)] bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-highest)] hover:text-[var(--primary)] rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back
                    </button>
                </div>

                <div className="bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-[var(--on-surface)] tracking-tight">
                                {file.name}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${FILE_TYPE_CONFIG[file.type.toLowerCase() as keyof typeof FILE_TYPE_CONFIG]?.color || ""
                                        } ${FILE_TYPE_CONFIG[file.type.toLowerCase() as keyof typeof FILE_TYPE_CONFIG]?.textColor || ""
                                        }`}
                                >
                                    {file.type}
                                </span>
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${FILE_STATUS_CONFIG[file.status as keyof typeof FILE_STATUS_CONFIG]?.color || ""
                                        }`}
                                >
                                    {file.status}
                                </span>
                                <div className="h-4 w-px bg-[var(--outline-variant)] mx-1" />

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-sm text-[var(--on-surface-variant)]">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-18 0h18" />
                                        </svg>
                                        <span>Effective: {file.effectiveDate}</span>
                                    </div>

                                    {file.clientEmail && (
                                        <>
                                            <div className="h-4 w-px bg-[var(--outline-variant)] mx-1" />
                                            <div className="flex items-center gap-1.5 text-sm text-[var(--on-surface-variant)]">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                                </svg>
                                                <span>To: {file.clientEmail}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-[var(--surface-container-high)] px-4 py-2 rounded-xl border border-[var(--outline-variant)]">
                            <span className="text-xl font-bold text-[var(--primary)]">{sheets.length}</span>
                            <span className="text-sm font-medium text-[var(--on-surface-variant)]">Sheets</span>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                {file.notes && (
                    <div className="mt-4 bg-[var(--secondary-container)] text-[var(--on-secondary-container)] p-4 rounded-2xl border border-[var(--outline-variant)] shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-1">Session Notes</h3>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {file.notes}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sheet Tabs */}
            {sheets.length > 0 ? (
                <div className="bg-[var(--surface)] rounded-2xl border border-[var(--outline-variant)] shadow-[var(--elevation-1)] overflow-hidden transition-all duration-300">
                    <SheetTabs
                        sheets={sheets.map((s) => ({ id: s.id, name: s.name }))}
                        activeSheetId={activeSheetId}
                        onTabChange={setActiveSheetId}
                    />

                    {/* Active Sheet Data Table */}
                    <div className="p-1">
                        {activeSheet ? (
                            <SheetDataTable data={activeSheet.data} />
                        ) : (
                            <p className="text-[var(--on-surface-variant)] text-sm text-center py-12">
                                Select a sheet tab above.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-[var(--surface)] rounded-2xl border border-[var(--outline-variant)] p-12 text-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-[var(--outline-variant)]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <p className="text-[var(--on-surface-variant)] font-medium">
                        This file has no sheets.
                    </p>
                </div>
            )}
        </div>
    );
}
