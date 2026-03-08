"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Sheet } from "@/core/sheet-builder";
import { filesService } from "@/services/filesService";
import { ValidationResult, ValidationIssue } from "@/core/feedback";
import type { FileType, SheetColumn, UpdateFileRequest } from "@/types/api";

export interface UseFileUpdateOptions {
    fileId: string;
    fileType: FileType;
    effectiveDate?: string;
    defaultFileName?: string;
    defaultClientEmail?: string;
    defaultNotes?: string;
    validateSheets?: (sheets: Sheet[]) => ValidationResult;
    validateShipment?: (shipment: any) => ValidationResult;
    onSuccess?: () => void;
    onError?: (error: string, issues?: ValidationIssue[]) => void;
}

interface UseFileUpdateReturn {
    handleUpdateFile: (sheets: Sheet[], shipmentDetails?: any) => void;
    isUpdating: boolean;
    fileNameModalProps: {
        isOpen: boolean;
        fileType: "OCEAN" | "AIR";
        effectiveDate: string;
        defaultName: string;
        defaultClientEmail: string;
        defaultNotes: string;
        onSave: (data: { fileName: string; clientEmail?: string; notes?: string }) => void;
        onCancel: () => void;
        isSaving: boolean;
    };
}

type BackendColumnType = "text" | "number" | "select";

function transformColumn(column: Sheet["columns"][number]): SheetColumn {
    let backendType: BackendColumnType = "text";

    switch (column.type) {
        case "text":
        case "date":
        case "boolean":
            backendType = "text";
            break;
        case "number":
            backendType = "number";
            break;
        case "select":
            backendType = "select";
            break;
        default:
            backendType = "text";
    }

    const result: SheetColumn = {
        id: column.id,
        label: column.label,
        type: backendType,
    };

    if ("options" in column && Array.isArray(column.options)) {
        result.options = column.options.map((opt: unknown) =>
            typeof opt === "string" ? opt : (opt as { value?: string; label: string }).value?.toString() || (opt as { label: string }).label,
        );
    }

    return result;
}

export function useFileUpdate(options: UseFileUpdateOptions): UseFileUpdateReturn {
    const {
        fileId,
        fileType,
        effectiveDate = new Date().toISOString().split("T")[0],
        defaultFileName = "",
        defaultClientEmail = "",
        defaultNotes = "",
        validateSheets,
        validateShipment,
        onSuccess,
        onError,
    } = options;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingSheets, setPendingSheets] = useState<Sheet[]>([]);
    const [pendingShipmentDetails, setPendingShipmentDetails] = useState<any | undefined>();
    const t = useTranslations();
    const queryClient = useQueryClient();

    const updateFileMutation = useMutation({
        mutationFn: (request: UpdateFileRequest) => filesService.updateFile(fileId, request),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["files"] }),
                queryClient.invalidateQueries({ queryKey: ["files", fileId] }),
                queryClient.invalidateQueries({ queryKey: ["files", fileId, "sheets"] }),
            ]);

            setIsModalOpen(false);
            setPendingSheets([]);
            setPendingShipmentDetails(undefined);
            onSuccess?.();
        },
        onError: (error) => {
            const errorMsg = error instanceof Error ? error.message : "Failed to update file. Please try again.";
            onError?.(errorMsg);
        }
    });

    const handleUpdateFile = useCallback(
        (sheets: Sheet[], shipmentDetails?: any) => {
            let combinedIssues: ValidationIssue[] = [];

            if (validateSheets) {
                const sheetValidation = validateSheets(sheets);
                if (!sheetValidation.isValid) {
                    combinedIssues = [...combinedIssues, ...sheetValidation.issues];
                }
            }

            if (shipmentDetails && validateShipment) {
                const shipmentValidation = validateShipment(shipmentDetails);
                if (!shipmentValidation.isValid) {
                    combinedIssues = [...combinedIssues, ...shipmentValidation.issues];
                }
            }

            if (combinedIssues.length > 0 || (validateSheets && !validateSheets(sheets).isValid)) {
                const errorMsg = combinedIssues.length > 0
                    ? t("feedback.validationFailed", { count: combinedIssues.length })
                    : t("feedback.addDataToSave");
                onError?.(errorMsg, combinedIssues);
                return;
            }

            if (sheets.length === 0) {
                onError?.("No sheets to update. Please create at least one sheet.");
                return;
            }

            setPendingSheets(sheets);
            setPendingShipmentDetails(shipmentDetails);
            setIsModalOpen(true);
        },
        [validateSheets, onError],
    );

    const handleFileNameConfirm = useCallback(
        (data: { fileName: string; clientEmail?: string; notes?: string }) => {
            const { fileName, clientEmail, notes } = data;

            if (pendingSheets.length === 0) {
                onError?.("No sheets to update");
                setIsModalOpen(false);
                return;
            }

            const sheetsData = pendingSheets.map((sheet) => ({
                name: sheet.name,
                data: {
                    id: sheet.id,
                    name: sheet.name,
                    columns: sheet.columns.map(transformColumn),
                    rows: sheet.rows,
                },
            }));

            const request = {
                name: fileName,
                effectiveDate,
                sheets: sheetsData,
                clientEmail,
                notes,
                shipmentDetails: pendingShipmentDetails,
            } as any;

            updateFileMutation.mutate(request);
        },
        [pendingSheets, pendingShipmentDetails, effectiveDate, updateFileMutation, onError],
    );

    const handleModalCancel = useCallback(() => {
        if (!updateFileMutation.isPending) {
            setIsModalOpen(false);
            setPendingSheets([]);
            setPendingShipmentDetails(undefined);
        }
    }, [updateFileMutation.isPending]);

    const fileNameModalProps = {
        isOpen: isModalOpen,
        fileType: fileType,
        effectiveDate: effectiveDate,
        defaultName: defaultFileName,
        defaultClientEmail: defaultClientEmail,
        defaultNotes: defaultNotes,
        onSave: handleFileNameConfirm,
        onCancel: handleModalCancel,
        isSaving: updateFileMutation.isPending,
    };

    return {
        handleUpdateFile,
        isUpdating: updateFileMutation.isPending,
        fileNameModalProps,
    };
}
