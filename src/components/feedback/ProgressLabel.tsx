"use client";

import React from "react";
import { useTranslations } from "next-intl";

export interface ProgressLabelProps {
  completed: number;
  total: number;
  label?: string;
}

/**
 * Displays progress as "Processed X of Y sheets"
 */
export const ProgressLabel: React.FC<ProgressLabelProps> = ({
  completed,
  total,
  label,
}) => {
  const t = useTranslations();
  const displayLabel = label ?? t("progress.processed");
  const isComplete = completed === total;

  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
          isComplete
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {isComplete ? (
          <svg
            className="w-3.5 h-3.5"
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
        ) : (
          <svg
            className="w-3.5 h-3.5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {displayLabel} {completed} {t("common.of")} {total} {t("common.sheets")}
      </span>
    </div>
  );
};
