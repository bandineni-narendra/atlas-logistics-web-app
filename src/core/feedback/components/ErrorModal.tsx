/**
 * Core Feedback - Error Modal
 *
 * Displays blocking errors with clear messaging.
 */

"use client";

import { BaseModal } from "./BaseModal";

export interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  detail?: string;
}

export function ErrorModal({
  isOpen,
  onClose,
  title = "Error",
  message,
  detail,
}: ErrorModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="error"
      size="sm"
      actions={
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
        >
          Close
        </button>
      }
    >
      <div className="flex flex-col items-center text-center py-4">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Message */}
        <p className="text-gray-700 text-base mb-2">{message}</p>

        {/* Detail */}
        {detail && (
          <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md mt-2">
            {detail}
          </p>
        )}
      </div>
    </BaseModal>
  );
}
