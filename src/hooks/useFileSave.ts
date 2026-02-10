/**
 * useFileSave Hook
 *
 * Manages the file save flow including:
 * - Opening file name modal
 * - Validating sheets before save
 * - Creating file with all sheets via API
 * - Showing feedback to user
 *
 * Usage:
 * ```tsx
 * const { handleSaveFile, FileNameModalComponent } = useFileSave({
 *   fileType: "AIR",
 *   effectiveDate: "2024-01-01",
 *   validateSheets: (sheets) => validateAirSheets(sheets),
 *   onSuccess: () => console.log("File saved!"),
 * });
 *
 * // In component:
 * <button onClick={() => handleSaveFile(sheets)}>Save</button>
 * {FileNameModalComponent}
 * ```
 */

"use client";

import React, { useState, useCallback } from "react";
import { Sheet } from "@/core/sheet-builder";
import { FileType } from "@/types/file";
import { createFile } from "@/api/files_client";
import { FileNameModal } from "@/components/ui";
import { ValidationResult } from "@/core/feedback";

export interface UseFileSaveOptions {
  /** File type (AIR or OCEAN) */
  fileType: FileType;

  /** Effective date for this freight data */
  effectiveDate?: string;

  /** Organization ID (defaults to user's org or "default") */
  orgId?: string;

  /** Default file name suggestion */
  defaultFileName?: string;

  /** Custom validation function for sheets */
  validateSheets?: (sheets: Sheet[]) => ValidationResult;

  /** Called when file is successfully saved */
  onSuccess?: (fileId: string, sheetIds: string[]) => void;

  /** Called when there's an error */
  onError?: (error: string) => void;
}

interface UseFileSaveReturn {
  /** Initiate the save flow - shows modal if valid */
  handleSaveFile: (sheets: Sheet[]) => void;

  /** Whether save is in progress */
  isSaving: boolean;

  /** Render this component in your UI */
  FileNameModalComponent: React.ReactNode;
}

export function useFileSave(options: UseFileSaveOptions): UseFileSaveReturn {
  const {
    fileType,
    effectiveDate = new Date().toISOString().split("T")[0],
    orgId = "default",
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

          onError?.(errorMsg);
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
    async (fileName: string) => {
      if (pendingSheets.length === 0) {
        onError?.("No sheets to save");
        setIsModalOpen(false);
        return;
      }

      setIsSaving(true);

      try {
        // Prepare sheets data
        const sheetsData = pendingSheets.map((sheet) => ({
          name: sheet.name,
          data: sheet,
        }));

        // Call API to create file with sheets
        const response = await createFile({
          name: fileName,
          type: fileType,
          effectiveDate,
          orgId,
          sheets: sheetsData,
        });

        // Success
        setIsModalOpen(false);
        setPendingSheets([]);
        onSuccess?.(response.fileId, response.sheetIds);
      } catch (error) {
        // Error
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Failed to save file. Please try again.";
        onError?.(errorMsg);
      } finally {
        setIsSaving(false);
      }
    },
    [pendingSheets, fileType, effectiveDate, orgId, onSuccess, onError],
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
