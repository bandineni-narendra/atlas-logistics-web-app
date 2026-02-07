/**
 * Core Feedback - Success Modal
 *
 * Displays success confirmation with optional auto-close.
 */

"use client";

import { useEffect } from "react";
import { BaseModal } from "./BaseModal";

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function SuccessModal({
  isOpen,
  onClose,
  title = "Success",
  message,
  autoClose = false,
  autoCloseDelay = 3000,
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="success"
      size="sm"
      actions={
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
        >
          OK
        </button>
      }
    >
      <div className="flex flex-col items-center text-center py-4">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Message */}
        <p className="text-gray-700 text-base">{message}</p>
      </div>
    </BaseModal>
  );
}
