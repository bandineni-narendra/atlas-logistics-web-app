"use client";

import React from "react";
import { FeedbackModalState } from "@/hooks/useFeedbackModal";

export interface FeedbackModalProps {
  state: FeedbackModalState;
  onClose: () => void;
}

const modalStyles = {
  success: {
    bgColor: "bg-[var(--success-container)]",
    borderColor: "border-[var(--success)]",
    iconBg: "bg-[var(--success)]",
    iconColor: "text-[var(--on-success)]",
    titleColor: "text-[var(--on-success-container)]",
    textColor: "text-[var(--on-success-container)]",
    buttonBg: "bg-[var(--success)] hover:brightness-110 text-[var(--on-success)]",
    icon: "✓",
  },
  error: {
    bgColor: "bg-[var(--error-container)]",
    borderColor: "border-[var(--error)]",
    iconBg: "bg-[var(--error)]",
    iconColor: "text-[var(--on-error)]",
    titleColor: "text-[var(--on-error-container)]",
    textColor: "text-[var(--on-error-container)]",
    buttonBg: "bg-[var(--error)] hover:brightness-110 text-[var(--on-error)]",
    icon: "✕",
  },
  warning: {
    bgColor: "bg-[var(--warning-container)]",
    borderColor: "border-[var(--warning)]",
    iconBg: "bg-[var(--warning)]",
    iconColor: "text-[var(--on-warning)]",
    titleColor: "text-[var(--on-warning-container)]",
    textColor: "text-[var(--on-warning-container)]",
    buttonBg: "bg-[var(--warning)] hover:brightness-110 text-black", // Warning usually needs dark text
    icon: "⚠",
  },
  info: {
    bgColor: "bg-[var(--surface-container)]",
    borderColor: "border-[var(--primary)]",
    iconBg: "bg-[var(--primary-container)]",
    iconColor: "text-[var(--on-primary-container)]",
    titleColor: "text-[var(--on-surface)]",
    textColor: "text-[var(--on-surface-variant)]",
    buttonBg: "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--on-primary)]",
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
          className={`${styles.bgColor} border-2 ${styles.borderColor} rounded-xl shadow-[var(--elevation-3)] max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in duration-200`}
          role="alertdialog"
          aria-modal="true"
        >
          {/* Header with Icon */}
          <div className="flex items-center gap-3 p-6 border-b border-[var(--outline-variant)] sticky top-0 bg-inherit rounded-t-[calc(0.75rem-2px)]">
            <div className={`${styles.iconBg} rounded-full p-2 flex-shrink-0`}>
              <span className={`${styles.iconColor} text-lg font-bold flex items-center justify-center w-6 h-6`}>
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
                      className={`text-sm p-3 rounded border-l-4 ${styles.borderColor} bg-[var(--surface-container-lowest)]`}
                    >
                      <div className={`font-medium ${styles.titleColor}`}>
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
          <div className="flex gap-3 p-6 border-t border-[var(--outline-variant)] justify-end bg-inherit rounded-b-[calc(0.75rem-2px)] sticky bottom-0">
            {state.type === "warning" && state.onConfirm ? (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-full font-medium text-[var(--on-surface)] bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-highest)] transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    state.onConfirm?.();
                    onClose();
                  }}
                  className={`px-6 py-2 rounded-full font-medium ${styles.buttonBg} transition-colors duration-150`}
                >
                  Confirm
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`px-6 py-2 rounded-full font-medium ${styles.buttonBg} transition-colors duration-150`}
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
