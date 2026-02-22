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
import { useTranslations } from "next-intl";
import { Input, Modal } from "@/components/ui";
import { FileType } from "@/types/file";

export interface FileNameModalPayload {
  fileName: string;
  clientEmail?: string;
  notes?: string;
}

export interface FileNameModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;

  /** File type (AIR or OCEAN) */
  fileType: FileType;

  /** Effective date for the file (optional) */
  effectiveDate?: string;

  /** Default file name (optional) */
  defaultName?: string;

  /** Called when user confirms with valid data */
  onSave: (data: FileNameModalPayload) => void;

  /** Called when user cancels */
  onCancel: () => void;

  /** Whether save operation is in progress */
  isSaving?: boolean;
}

// Helper functions (removed from top level to access t() inside component or passed as args)

export const FileNameModal: React.FC<FileNameModalProps> = ({
  isOpen,
  fileType,
  effectiveDate,
  defaultName = "",
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const t = useTranslations("fileNameModal");
  const [fileName, setFileName] = useState(defaultName);
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ fileName?: string; clientEmail?: string }>({});
  const [touched, setTouched] = useState<{ fileName?: boolean; clientEmail?: boolean }>({});

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setFileName(defaultName);
      setClientEmail("");
      setNotes("");
      setErrors({});
      setTouched({});
    }
  }, [isOpen, defaultName]);

  // Handle validation
  const validate = (nameValue: string, emailValue: string) => {
    const newErrors: { fileName?: string; clientEmail?: string } = {};
    const trimmed = nameValue.trim();

    // File Name Validation
    if (!trimmed) {
      newErrors.fileName = t("errors.nameRequired");
    } else if (trimmed.length < 3) {
      newErrors.fileName = t("errors.nameMinLength");
    } else if (trimmed.length > 100) {
      newErrors.fileName = t("errors.nameMaxLength");
    } else {
      const invalidChars = /[<>:"/\\|?*]/;
      if (invalidChars.test(trimmed)) {
        newErrors.fileName = t("errors.nameInvalidChars");
      }
    }

    // Email Validation
    if (emailValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        newErrors.clientEmail = t("errors.invalidEmail");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    setTouched({ fileName: true, clientEmail: true });
    if (validate(fileName, clientEmail)) {
      onSave({
        fileName: fileName.trim(),
        clientEmail: clientEmail.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }
  };

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSaving && e.target instanceof HTMLInputElement) {
      // Don't submit on Enter if in textarea
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape" && !isSaving) {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} preventBackdropClose={isSaving} maxWidth="max-w-md">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-[var(--outline-variant)]">
        <div className="bg-[var(--primary-container)] rounded-full p-3 flex-shrink-0">
          <span className="text-[var(--on-primary-container)] text-2xl">📁</span>
        </div>
        <h2
          id="file-name-modal-title"
          className="text-[var(--on-surface)] font-bold text-xl flex-1"
        >
          {t("title", { type: fileType === "AIR" ? "Air" : "Ocean" })}
        </h2>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {/* Info text */}
        <p className="text-sm text-[var(--on-surface-variant)]">
          {t("info")}
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
            {t("fields.fileName")} <span className="text-[var(--error)]">*</span>
          </label>
          <input
            type="text"
            placeholder={t("placeholders.fileName")}
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              if (touched.fileName) validate(e.target.value, clientEmail);
            }}
            onBlur={() => setTouched(prev => ({ ...prev, fileName: true }))}
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
              ${touched.fileName && errors.fileName ? 'border-[var(--error)] focus:ring-[var(--error)]' : 'border-[var(--outline)]'}
            `}
          />
          {touched.fileName && errors.fileName && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.fileName}</p>
          )}
        </div>

        {/* To Client input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--on-surface-variant)]">
            {t("fields.clientEmail")}
          </label>
          <input
            type="email"
            placeholder={t("placeholders.clientEmail")}
            value={clientEmail}
            onChange={(e) => {
              setClientEmail(e.target.value);
              if (touched.clientEmail) validate(fileName, e.target.value);
            }}
            onBlur={() => setTouched(prev => ({ ...prev, clientEmail: true }))}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className={`
              w-full px-3 py-2 
              bg-[var(--surface-container-lowest)] 
              border rounded-md 
              text-[var(--on-surface)] 
              placeholder-[var(--on-surface-variant)]
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
              disabled:opacity-50
              ${touched.clientEmail && errors.clientEmail ? 'border-[var(--error)] focus:ring-[var(--error)]' : 'border-[var(--outline)]'}
            `}
          />
          {touched.clientEmail && errors.clientEmail && (
            <p className="text-xs text-[var(--error)] mt-1">{errors.clientEmail}</p>
          )}
        </div>

        {/* Notes input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--on-surface-variant)]">
            {t("fields.notes")}
          </label>
          <textarea
            placeholder={t("placeholders.notes")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSaving}
            rows={3}
            className="
              w-full px-3 py-2 
              bg-[var(--surface-container-lowest)] 
              border border-[var(--outline)] rounded-md 
              text-[var(--on-surface)] 
              placeholder-[var(--on-surface-variant)]
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
              disabled:opacity-50
              resize-none
            "
          />
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
          disabled={isSaving || Object.keys(errors).length > 0}
          className="px-6 py-2 rounded-full font-medium text-[var(--on-primary)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-[var(--on-primary)] border-t-transparent rounded-full animate-spin" />
              {t("buttons.saving")}
            </>
          ) : (
            t("buttons.save")
          )}
        </button>
      </div>
    </Modal>
  );
};
