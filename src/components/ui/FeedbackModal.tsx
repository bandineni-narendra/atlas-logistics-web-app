"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FeedbackModalState } from "@/hooks/useFeedbackModal";
import { Modal } from "@/components/ui";

export interface FeedbackModalProps {
  state: FeedbackModalState;
  onClose: () => void;
}

const modalStyles = {
  success: {
    bgColor: "bg-surface",
    borderColor: "border-success/30",
    iconBg: "bg-success/15",
    iconColor: "text-success",
    titleColor: "text-success",
    textColor: "text-textSecondary",
    buttonBg: "bg-success hover:bg-success/90 text-white",
    icon: "✓",
  },
  error: {
    bgColor: "bg-surface",
    borderColor: "border-error/30",
    iconBg: "bg-error/15",
    iconColor: "text-error",
    titleColor: "text-error",
    textColor: "text-textSecondary",
    buttonBg: "bg-error hover:bg-error/90 text-white",
    icon: "✕",
  },
  warning: {
    bgColor: "bg-surface",
    borderColor: "border-warning/30",
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
    titleColor: "text-warning",
    textColor: "text-textSecondary",
    buttonBg: "bg-warning hover:bg-warning/90 text-white",
    icon: "⚠",
  },
  info: {
    bgColor: "bg-surface",
    borderColor: "border-primary/30",
    iconBg: "bg-primary-soft",
    iconColor: "text-primary",
    titleColor: "text-textPrimary",
    textColor: "text-textSecondary",
    buttonBg: "bg-primary hover:bg-primary-hover text-white",
    icon: "ℹ",
  },
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  state,
  onClose,
}) => {
  const t = useTranslations();
  if (!state.isOpen || !state.type) {
    return null;
  }


  const styles = modalStyles[state.type];
  const isSpecial = state.type !== "info";

  return (
    <Modal
      isOpen={state.isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      className="bg-surface"
    >
      {/* Header with Icon */}
      <div className={`flex items-center gap-3 p-6 border-b border-border/20 sticky top-0 bg-inherit rounded-t-[calc(0.75rem-2px)]`}>
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
              {t("feedback.issuesFound")}
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(
                state.issues.reduce((acc, issue) => {
                  const key = `${issue.sheetName}|${issue.rowIndex}`;
                  if (!acc[key]) acc[key] = { sheetName: issue.sheetName, rowIndex: issue.rowIndex, columns: [] };
                  acc[key].columns.push(issue.columnLabel);
                  return acc;
                }, {} as Record<string, { sheetName: string; rowIndex: number; columns: string[] }>)
              ).map(([key, group]) => (
                <div
                  key={key}
                  className={`text-sm p-4 rounded-xl border border-border bg-background shadow-sm`}
                >
                  <div className={`font-bold text-base mb-2 flex items-center gap-2 ${styles.titleColor}`}>
                    <span className="w-1.5 h-6 bg-primary rounded-full mr-1"></span>
                    {group.sheetName} • {t("feedback.row")} {group.rowIndex}
                  </div>
                  <div className={`text-sm ${styles.textColor} leading-relaxed pl-4`}>
                    <span className="font-semibold text-primary mr-2">
                      Missing:
                    </span>
                    <span className="opacity-90 italic">
                      {group.columns.join(", ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-surface);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-border);
        }
      `}</style>

      {/* Footer */}
      <div className="flex gap-3 p-6 border-t border-border justify-end bg-inherit rounded-b-[calc(0.75rem-2px)] sticky bottom-0">
        {state.type === "warning" && state.onConfirm ? (
          <>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full font-medium text-textPrimary bg-surface hover:bg-primary-soft transition-colors duration-150"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={() => {
                state.onConfirm?.();
                onClose();
              }}
              className={`px-6 py-2 rounded-full font-medium ${styles.buttonBg} transition-colors duration-150`}
            >
              {t("common.confirm")}
            </button>
          </>
        ) : (
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-full font-medium ${styles.buttonBg} transition-colors duration-150`}
          >
            {t("common.ok")}
          </button>
        )}
      </div>
    </Modal>
  );
};
