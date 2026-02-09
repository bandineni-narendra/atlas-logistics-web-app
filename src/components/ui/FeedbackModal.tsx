"use client";

import React from "react";
import { FeedbackModalState } from "@/hooks/useFeedbackModal";

export interface FeedbackModalProps {
  state: FeedbackModalState;
  onClose: () => void;
}

const modalStyles = {
  success: {
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    titleColor: "text-emerald-900",
    textColor: "text-emerald-800",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700",
    icon: "✓",
  },
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    titleColor: "text-red-900",
    textColor: "text-red-800",
    buttonBg: "bg-red-600 hover:bg-red-700",
    icon: "✕",
  },
  warning: {
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    titleColor: "text-amber-900",
    textColor: "text-amber-800",
    buttonBg: "bg-amber-600 hover:bg-amber-700",
    icon: "⚠",
  },
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    titleColor: "text-blue-900",
    textColor: "text-blue-800",
    buttonBg: "bg-blue-600 hover:bg-blue-700",
    icon: "ℹ",
  },
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  state,
  onClose,
}) => {
  if (!state.isOpen || !state.type) {
    return null;
  }

  const styles = modalStyles[state.type];

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className={`${styles.bgColor} border-2 ${styles.borderColor} rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in duration-200`}
          role="alertdialog"
          aria-modal="true"
        >
          {/* Header with Icon */}
          <div className="flex items-center gap-3 p-6 border-b-2 border-gray-300 sticky top-0 bg-inherit rounded-t-[calc(0.5rem-2px)]">
            <div className={`${styles.iconBg} rounded-full p-3 flex-shrink-0`}>
              <span className={`${styles.iconColor} text-2xl font-bold`}>
                {styles.icon}
              </span>
            </div>
            <h2 className={`${styles.titleColor} font-bold text-xl flex-1`}>
              {state.title}
            </h2>
          </div>

          {/* Body */}
          <div className="p-6">
            {state.message && (
              <div
                className={`${styles.textColor} text-base leading-relaxed mb-4`}
              >
                {state.message}
              </div>
            )}

            {/* Issues list */}
            {state.issues && state.issues.length > 0 && (
              <div className="mt-4">
                <div
                  className={`${styles.textColor} text-sm font-semibold mb-3`}
                >
                  Issues found:
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {state.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`text-sm p-3 rounded border-l-4 ${styles.borderColor} bg-white`}
                    >
                      <div className={`font-medium ${styles.textColor}`}>
                        {issue.sheetName} • Row {issue.rowIndex}
                      </div>
                      <div
                        className={`text-xs mt-1 ${styles.textColor} opacity-85`}
                      >
                        <span className="font-semibold">
                          {issue.columnLabel}:
                        </span>{" "}
                        {issue.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t-2 border-gray-300 justify-end bg-gray-50 rounded-b-[calc(0.5rem-2px)] sticky bottom-0">
            {state.type === "warning" && state.onConfirm ? (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    state.onConfirm?.();
                    onClose();
                  }}
                  className={`px-6 py-2 rounded-md font-semibold text-white ${styles.buttonBg} transition-colors duration-150`}
                >
                  Confirm
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`px-6 py-2 rounded-md font-semibold text-white ${styles.buttonBg} transition-colors duration-150`}
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
