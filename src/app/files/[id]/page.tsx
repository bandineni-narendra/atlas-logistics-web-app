"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFileDetail, useFileSheets } from "@/hooks/queries/useFiles";
import { SheetTabs, SheetDataTable, FileDetailHeader, FileNotesSection, BackButton } from "@/components/file-detail";
import { useUI } from "@/contexts/UIContext";
import { FILE_TYPE_CONFIG, FILE_STATUS_CONFIG } from "@/constants";
import { FileQuestion } from "lucide-react";

/**
 * File Detail Page
 * Route: /files/:id
 */
export default function FileDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const fileId = params.id;
    const { isSidebarCollapsed } = useUI();

    const { data: detailData, isLoading: detailLoading, error: detailError } =
        useFileDetail(fileId);
    const { data: sheetsData, isLoading: sheetsLoading, error: sheetsError } =
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
    // Will be partially intercepted if suspense is true, otherwise minimal return
    if (detailLoading || sheetsLoading) {
        return null; // Prevents flashing while waiting for data
    }

    // --- Error ---
    // Let Next.js Error Boundary (error.tsx) catch these
    if (detailError) {
        throw detailError instanceof Error ? detailError : new Error("Failed to load file details");
    }
    if (sheetsError) {
        throw sheetsError instanceof Error ? sheetsError : new Error("Failed to load sheet details");
    }
    if (!file) {
        throw new Error("File not found");
    }

    return (
        <div className={`mx-auto px-4 py-6 transition-all duration-300 ${isSidebarCollapsed ? "max-w-[98%]" : "max-w-7xl"}`}>
            {/* Header & Back Button */}
            <div className="mb-6 flex flex-col gap-4">
                <BackButton />
                <FileDetailHeader file={file} />
                <FileNotesSection notes={file.notes} />
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
                            <SheetDataTable
                                fileId={fileId}
                                sheetId={activeSheet.id}
                                columns={activeSheet.data.columns}
                                initialTotalRows={activeSheet.rowCount}
                            />
                        ) : (
                            <p className="text-[var(--on-surface-variant)] text-sm text-center py-12">
                                Select a sheet tab above.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-[var(--surface)] rounded-2xl border border-[var(--outline-variant)] p-12 text-center shadow-sm">
                    <FileQuestion className="w-16 h-16 mx-auto mb-4 text-[var(--outline-variant)]" />
                    <p className="text-[var(--on-surface-variant)] font-medium">
                        This file has no sheets.
                    </p>
                </div>
            )}
        </div>
    );
}
