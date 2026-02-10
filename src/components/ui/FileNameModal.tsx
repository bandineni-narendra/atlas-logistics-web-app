/**
 * File Name Modal Component
 *
 * Modal for capturing file name before saving sheets.
 * Required step in the Sheet Builder save flow.
 *
 * Usage:
 * ```tsx
 * <FileNameModal
 *   isOpen={isOpen}
 *   fileType="AIR"
 *   effectiveDate="2024-01-01"
 *   onSave={(fileName) => handleSave(fileName)}
 *   onCancel={() => setIsOpen(false)}
 * />
 * ```
 */

"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui";
import { FileType } from "@/types/file";

export interface FileNameModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;

  /** File type (AIR or OCEAN) */
  fileType: FileType;

  /** Effective date for the file (optional) */
  effectiveDate?: string;

  /** Default file name (optional) */
  defaultName?: string;

  /** Called when user confirms with valid file name */
  onSave: (fileName: string) => void;

  /** Called when user cancels */
  onCancel: () => void;

  /** Whether save operation is in progress */
  isSaving?: boolean;
}

/**
 * Validate file name
 */
function validateFileName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "File name is required";
  }

  if (trimmed.length < 3) {
    return "File name must be at least 3 characters";
  }

  if (trimmed.length > 100) {
    return "File name must be less than 100 characters";
  }

  // Check for invalid characters (optional - adjust based on backend requirements)
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(trimmed)) {
    return "File name contains invalid characters";
  }

  return null;
}

export const FileNameModal: React.FC<FileNameModalProps> = ({
  isOpen,
  fileType,
  effectiveDate,
  defaultName = "",
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const [fileName, setFileName] = useState(defaultName);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setFileName(defaultName);
      setError(null);
      setTouched(false);
    }
  }, [isOpen, defaultName]);

  // Validate on blur
  const handleBlur = () => {
    setTouched(true);
    const validationError = validateFileName(fileName);
    setError(validationError);
  };

  // Handle save
  const handleSave = () => {
    const validationError = validateFileName(fileName);

    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }

    onSave(fileName.trim());
  };

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSaving) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape" && !isSaving) {
      e.preventDefault();
      onCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={isSaving ? undefined : onCancel}
        role="presentation"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white border-2 border-gray-300 rounded-lg shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="file-name-modal-title"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b-2 border-gray-200">
            <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
              <span className="text-blue-600 text-2xl">📁</span>
            </div>
            <h2
              id="file-name-modal-title"
              className="text-gray-900 font-bold text-xl flex-1"
            >
              Save {fileType} Freight File
            </h2>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Info text */}
            <p className="text-sm text-gray-600">
              Enter a name for this file. All sheets in the current session will
              be saved together.
            </p>

            {/* File metadata display */}
            {effectiveDate && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold text-gray-900">
                    {fileType}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">Effective Date:</span>
                  <span className="font-semibold text-gray-900">
                    {effectiveDate}
                  </span>
                </div>
              </div>
            )}

            {/* File name input */}
            <Input
              label="File Name"
              type="text"
              placeholder="e.g., Atlantic Routes Q1 2024"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
                if (touched) {
                  setError(validateFileName(e.target.value));
                }
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              error={touched ? error || undefined : undefined}
              disabled={isSaving}
              required
              fullWidth
              autoFocus
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t-2 border-gray-200 justify-end bg-gray-50 rounded-b-lg">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-6 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !!error}
              className="px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save File"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
