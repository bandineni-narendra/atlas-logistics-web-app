/**
 * useFileSave Hook
 *
 * Manages the file save flow including:
 * - Opening file name modal
 * - Validating sheets before save
 * - Creating file with all sheets via API
 * - Showing feedback to user
 */

"use client";

import React, { useState, useCallback } from "react";
import { Sheet } from "@/core/sheet-builder";
import { filesService } from "@/services/filesService";
import { FileNameModal } from "@/components/ui";
import { ValidationResult, ValidationIssue } from "@/core/feedback";
import type { FileType, SheetColumn, CreateFileRequest } from "@/types/api";

export interface UseFileSaveOptions {
  /** File type (AIR or OCEAN) */
  fileType: FileType;

  /** Effective date for this freight data */
  effectiveDate?: string;

  /** Default file name suggestion */
  defaultFileName?: string;

  /** Custom validation function for sheets */
  validateSheets?: (sheets: Sheet[]) => ValidationResult;

  /** Called when file is successfully saved */
  onSuccess?: (fileId: string, sheetIds: string[]) => void;

  /** Called when there's an error */
  onError?: (error: string, issues?: ValidationIssue[]) => void;
}

interface UseFileSaveReturn {
  /** Initiate the save flow - shows modal if valid */
  handleSaveFile: (sheets: Sheet[]) => void;

  /** Whether save is in progress */
  isSaving: boolean;

  /** Render this component in your UI */
  FileNameModalComponent: React.ReactNode;
}

/**
 * Backend column type mapping
 */
type BackendColumnType = "text" | "number" | "select";

/**
 * Transform frontend column to backend-compatible format
 */
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

  // Transform options from { label, value } objects to string array
  if ("options" in column && Array.isArray(column.options)) {
    result.options = column.options.map((opt: unknown) =>
      typeof opt === "string" ? opt : (opt as { value?: string; label: string }).value?.toString() || (opt as { label: string }).label,
    );
  }

  return result;
}

export function useFileSave(options: UseFileSaveOptions): UseFileSaveReturn {
  const {
    fileType,
    effectiveDate = new Date().toISOString().split("T")[0],
    defaultFileName = "",
    validateSheets,
    onSuccess,
    onError,
  } = options;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingSheets, setPendingSheets] = useState<Sheet[]>([]);

  /**
   * Start the save flow
   */
  const handleSaveFile = useCallback(
    (sheets: Sheet[]) => {
      // Validate sheets first (if validator provided)
      if (validateSheets) {
        const validationResult = validateSheets(sheets);

        if (!validationResult.isValid) {
          const errorMsg =
            validationResult.issues.length > 0
              ? `Validation failed: ${validationResult.issues.length} issue(s) found`
              : "No data to save. Please add at least one complete row.";

          onError?.(errorMsg, validationResult.issues);
          return;
        }
      }

      // Check if there's at least one sheet
      if (sheets.length === 0) {
        onError?.("No sheets to save. Please create at least one sheet.");
        return;
      }

      // Store sheets and open modal
      setPendingSheets(sheets);
      setIsModalOpen(true);
    },
    [validateSheets, onError],
  );

  /**
   * Handle file name confirmation and API call
   */
  const handleFileNameConfirm = useCallback(
    async (data: { fileName: string; clientEmail?: string; notes?: string }) => {
      const { fileName, clientEmail, notes } = data;

      if (pendingSheets.length === 0) {
        onError?.("No sheets to save");
        setIsModalOpen(false);
        return;
      }

      setIsSaving(true);

      try {
        // Prepare sheets data — transform columns to backend format
        const sheetsData = pendingSheets.map((sheet) => ({
          name: sheet.name,
          data: {
            id: sheet.id,
            name: sheet.name,
            columns: sheet.columns.map(transformColumn),
            rows: sheet.rows,
          },
        }));

        // Build the request matching the new CreateFileRequest type
        const request: CreateFileRequest = {
          name: fileName,
          type: fileType,
          effectiveDate,
          sheets: sheetsData,
          clientEmail,
          notes,
        };

        // Call the unified files service
        const response = await filesService.createFile(request);

        // Success
        setIsModalOpen(false);
        setPendingSheets([]);
        onSuccess?.(response.fileId, response.sheetIds);
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Failed to save file. Please try again.";
        onError?.(errorMsg);
      } finally {
        setIsSaving(false);
      }
    },
    [pendingSheets, fileType, effectiveDate, onSuccess, onError],
  );

  /**
   * Handle modal cancel
   */
  const handleModalCancel = useCallback(() => {
    if (!isSaving) {
      setIsModalOpen(false);
      setPendingSheets([]);
    }
  }, [isSaving]);

  // Modal component
  const FileNameModalComponent = React.createElement(FileNameModal, {
    isOpen: isModalOpen,
    fileType: fileType,
    effectiveDate: effectiveDate,
    defaultName: defaultFileName,
    onSave: handleFileNameConfirm,
    onCancel: handleModalCancel,
    isSaving: isSaving,
  });

  return {
    handleSaveFile,
    isSaving,
    FileNameModalComponent,
  };
}
