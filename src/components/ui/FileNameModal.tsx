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
          className="bg-[var(--surface)] border-2 border-[var(--outline-variant)] rounded-xl shadow-[var(--elevation-2)] max-w-md w-full animate-in fade-in zoom-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="file-name-modal-title"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-[var(--outline-variant)]">
            <div className="bg-[var(--primary-container)] rounded-full p-3 flex-shrink-0">
              <span className="text-[var(--on-primary-container)] text-2xl">📁</span>
            </div>
            <h2
              id="file-name-modal-title"
              className="text-[var(--on-surface)] font-bold text-xl flex-1"
            >
              Save {fileType} Freight File
            </h2>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Info text */}
            <p className="text-sm text-[var(--on-surface-variant)]">
              Enter a name for this file. All sheets in the current session will
              be saved together.
            </p>

            {/* File metadata display */}
            {effectiveDate && (
              <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--on-surface-variant)]">Type:</span>
                  <span className="font-semibold text-[var(--on-surface)]">
                    {fileType}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[var(--on-surface-variant)]">Effective Date:</span>
                  <span className="font-semibold text-[var(--on-surface)]">
                    {effectiveDate}
                  </span>
                </div>
              </div>
            )}

            {/* File name input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--on-surface-variant)]">
                File Name
              </label>
              <input
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
                disabled={isSaving}
                autoFocus
                className={`
                        w-full px-3 py-2 
                        bg-[var(--surface-container-lowest)] 
                        border rounded-md 
                        text-[var(--on-surface)] 
                        placeholder-[var(--on-surface-variant)]
                        focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                        disabled:opacity-50
                        ${touched && error ? 'border-[var(--error)] focus:ring-[var(--error)]' : 'border-[var(--outline)]'}
                    `}
              />

              {touched && error && (
                <p className="text-xs text-[var(--error)] mt-1">{error}</p>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-[var(--outline-variant)] justify-end bg-[var(--surface-container-low)] rounded-b-xl">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-6 py-2 rounded-full font-medium text-[var(--on-surface)] bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-highest)] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !!error}
              className="px-6 py-2 rounded-full font-medium text-[var(--on-primary)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-[var(--on-primary)] border-t-transparent rounded-full animate-spin" />
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
