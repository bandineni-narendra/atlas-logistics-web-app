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
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  /** Default notes/terms */
  defaultNotes?: string;

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

  /** Modal properties */
  fileNameModalProps: {
    isOpen: boolean;
    fileType: "OCEAN" | "AIR";
    effectiveDate: string;
    defaultName: string;
    onSave: (data: { fileName: string; clientEmail?: string; notes?: string }) => void;
    onCancel: () => void;
    isSaving: boolean;
  };
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

const DEFAULT_AIR_NOTES = `NOTE:
1) THE ABOVE RATES ARE ABSOLUTE NET/NET & QUOTED ON AIRPORT TO AIRPORT BASIS.
2) FOR MINIMUM SHIPMENTS, SURCHARGES OF USD 7.00/KG IS APPLICABLE.
3) THE ABOVE RATES ARE PREVAILING RATES AND SUBJECT TO CHANGE BY AIRLINES WITHOUT PRIOR NOTICE
4) FSC & SCC SURCHARGES ARE PREVAILING CHARGES & ARE APPLICABLE AT ACTUALS AT THE TIME OF SHIPMENT
5) THE ABOVE RATES ARE VALID TILL
6) AMS USD 15/per hawb and per mawb is charged by the carrier
7) RATES & TRANSIT TIMES ARE SUBJECT TO SPACE CONFIRMATION AND ARE TENTATIVE
8) THE ABOVE RATES ARE SUBJECT TO CHANGE BY THE AIRLINES.`;

const DEFAULT_OCEAN_NOTES = `NOTE:
1) THE ABOVE RATES ARE NET/NET & ARE QUOTED ON PORT TO PORT BASIS.
2) RATES ARE VALID TILL
3) THE ABOVE RATES ARE FOR GENERAL CARGO ONLY Sub to equipment/space availability. Rates are subject to future GRI if applicable at time of shipment.
4) This does not include any detention charges
5) This is applicable for the normal weight 14.0 TONS and not for Over dimenion or heavy weight shipment
6) INLAND HAULAGE QUOTED FOR MAX OF 14 tons for 40'
7) RATES QUOTED BASED ON CFS / FACTORY STUFFING subject to availability of permission with the shipper.`;

export function useFileSave(options: UseFileSaveOptions): UseFileSaveReturn {
  const {
    fileType,
    effectiveDate = new Date().toISOString().split("T")[0],
    defaultFileName = "",
    defaultNotes,
    validateSheets,
    onSuccess,
    onError,
  } = options;

  const resolvedDefaultNotes = defaultNotes !== undefined
    ? defaultNotes
    : (fileType === "AIR" ? DEFAULT_AIR_NOTES : DEFAULT_OCEAN_NOTES);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingSheets, setPendingSheets] = useState<Sheet[]>([]);
  const queryClient = useQueryClient();

  // Replace manual state with React Query's useMutation
  const createFileMutation = useMutation({
    mutationFn: (request: CreateFileRequest) => filesService.createFile(request),
    onSuccess: (response) => {
      // Invalidate relevant queries so UI auto-updates
      queryClient.invalidateQueries({ queryKey: ["files"] });

      setIsModalOpen(false);
      setPendingSheets([]);
      onSuccess?.(response.fileId, response.sheetIds);
    },
    onError: (error) => {
      const errorMsg = error instanceof Error ? error.message : "Failed to save file. Please try again.";
      onError?.(errorMsg);
    }
  });

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
    (data: { fileName: string; clientEmail?: string; notes?: string }) => {
      const { fileName, clientEmail, notes } = data;

      if (pendingSheets.length === 0) {
        onError?.("No sheets to save");
        setIsModalOpen(false);
        return;
      }

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

      // Trigger mutation
      createFileMutation.mutate(request);
    },
    [pendingSheets, fileType, effectiveDate, createFileMutation, onError],
  );

  /**
   * Handle modal cancel
   */
  const handleModalCancel = useCallback(() => {
    if (!createFileMutation.isPending) {
      setIsModalOpen(false);
      setPendingSheets([]);
    }
  }, [createFileMutation.isPending]);

  // Return properties so the consuming component can render the modal
  const fileNameModalProps = {
    isOpen: isModalOpen,
    fileType: fileType,
    effectiveDate: effectiveDate,
    defaultName: defaultFileName,
    defaultNotes: resolvedDefaultNotes,
    onSave: handleFileNameConfirm,
    onCancel: handleModalCancel,
    isSaving: createFileMutation.isPending,
  };

  return {
    handleSaveFile,
    isSaving: createFileMutation.isPending,
    fileNameModalProps,
  };
}
