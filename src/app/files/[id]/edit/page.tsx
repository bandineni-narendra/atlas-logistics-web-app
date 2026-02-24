"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { SheetBuilder, Sheet, Column } from "@/core/sheet-builder";
import { useFileUpdate, useFeedbackModal } from "@/hooks";
import { filesService } from "@/services/filesService";
import { Alert, Card, Button, FileNameModal } from "@/components/ui";

/**
 * File Edit Page
 * Allows users to edit an existing file's name, metadata, and all its sheets.
 */
export default function FileEditPage() {
    const t = useTranslations();
    const router = useRouter();
    const params = useParams();
    const fileId = params?.id as string;

    const [localSheets, setLocalSheets] = useState<Sheet[]>([]);
    const { openModal } = useFeedbackModal();

    // 1. Fetch File Metadata
    const { data: fileData, isLoading: fileLoading, error: fileError } = useQuery({
        queryKey: ["files", fileId],
        queryFn: () => filesService.getFileDetail(fileId),
        enabled: !!fileId,
    });

    // 2. Fetch File Sheets Data
    const { data: sheetsData, isLoading: sheetsLoading, error: sheetsError } = useQuery({
        queryKey: ["files", fileId, "sheets"],
        queryFn: () => filesService.getFileSheets(fileId),
        enabled: !!fileId,
    });

    const isLoading = fileLoading || sheetsLoading;
    const isError = fileError || sheetsError;

    // Initialize sheets when data arrives
    useEffect(() => {
        if (sheetsData?.sheets) {
            const extracted: Sheet[] = sheetsData.sheets.map((s) => {
                // Cast SheetColumn to proper builder Column
                const builderColumns = s.data.columns.map((col) => {
                    let castedType: "text" | "number" | "select" | "date" | "boolean" = "text";
                    if (col.type === "number") castedType = "number";
                    else if (col.type === "select") castedType = "select";

                    return {
                        id: col.id,
                        label: col.label,
                        type: castedType,
                        options: col.options,
                    } as Column;
                });

                return {
                    id: s.id,
                    name: s.name,
                    columns: builderColumns,
                    rows: s.data.rows || [],
                };
            });
            setLocalSheets(extracted);
        }
    }, [sheetsData]);

    const fileDetail = fileData?.file;

    // Setup the Update Hook
    const { handleUpdateFile, isUpdating, fileNameModalProps } = useFileUpdate({
        fileId,
        fileType: fileDetail?.type || "OCEAN",
        effectiveDate: fileDetail?.effectiveDate,
        defaultFileName: fileDetail?.name,
        defaultClientEmail: fileDetail?.clientEmail,
        defaultNotes: fileDetail?.notes,
        validateSheets: (sheets: Sheet[]) => {
            // Basic validation: at least 1 sheet with 1 row
            if (sheets.length === 0) return { isValid: false, issues: [] };
            const hasData = sheets.some((s) => s.rows.length > 0);
            return { isValid: hasData, issues: [] };
        },
        onSuccess: () => {
            openModal(
                "success",
                "File Updated",
                "The file was successfully updated.",
            );
            // Route back to the file overview page
            router.push(`/files/${fileId}`);
        },
        onError: (msg) => {
            openModal(
                "error",
                "Update Failed",
                msg
            );
        },
    });

    const headerActions = useMemo(
        () => (
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => router.push(`/files/${fileId}`)}
                    disabled={isUpdating}
                >
                    {t("common.cancel")}
                </Button>
                <Button
                    variant="primary"
                    onClick={() => handleUpdateFile(localSheets)}
                    disabled={isUpdating || localSheets.length === 0}
                >
                    {t("common.save")}
                </Button>
            </div>
        ),
        [localSheets, isUpdating, handleUpdateFile, router, fileId, t]
    );

    if (isLoading) {
        return (
            <main className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </main>
        );
    }

    if (isError || !fileDetail) {
        return (
            <main className="p-6">
                <Alert variant="error" title="Error Loading File">
                    We couldn't load the file details. Please try again.
                </Alert>
            </main>
        );
    }

    return (
        <main className="px-6 py-5 max-w-[1600px] mx-auto flex flex-col w-full h-full relative">
            <header className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-medium text-textPrimary tracking-tight">
                        Editing {fileDetail.name}
                    </h1>
                    <p className="mt-0.5 text-sm text-textSecondary">
                        Modify the file name, column structures, and row values.
                    </p>
                </div>
                {headerActions}
            </header>

            {/* Editor Component */}
            <Card padding="none" className="flex-1 flex flex-col min-h-0 min-h-[500px]">
                {localSheets.length > 0 ? (
                    <SheetBuilder
                        initialSheets={localSheets}
                        onChange={(newSheets) => setLocalSheets(newSheets)}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-textSecondary text-sm">
                        {t("common.loading") || "Loading properties..."}
                    </div>
                )}
            </Card>

            <FileNameModal {...fileNameModalProps} />
        </main>
    );
}
