/**
 * Core Feedback - Warning Modal
 *
 * Displays warnings with option to continue or review.
 */

"use client";

import { BaseModal } from "./BaseModal";

export interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
  title?: string;
  message: string;
  continueLabel?: string;
  cancelLabel?: string;
}

export function WarningModal({
  isOpen,
  onClose,
  onContinue,
  title = "Warning",
  message,
  continueLabel = "Continue",
  cancelLabel = "Review",
}: WarningModalProps) {
  const handleContinue = () => {
    onContinue?.();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="warning"
      size="sm"
      actions={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            {cancelLabel}
          </button>
          {onContinue && (
            <button
              onClick={handleContinue}
              className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors"
            >
              {continueLabel}
            </button>
          )}
        </>
      }
    >
      <div className="flex flex-col items-center text-center py-4">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Message */}
        <p className="text-gray-700 text-base">{message}</p>
      </div>
    </BaseModal>
  );
}
