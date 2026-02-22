"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";

export interface ErrorBoxProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * Reusable error message box
 * Displays error with optional retry action
 */
export const ErrorBox: React.FC<ErrorBoxProps> = ({
  title,
  message,
  onRetry,
  retryLabel,
}) => {
  const t = useTranslations();
  const displayTitle = title ?? t("errors.title");
  const displayRetryLabel = retryLabel ?? t("buttons.tryAgain");

  return (
    <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
      <div className="flex-shrink-0 w-5 h-5 text-red-500 mt-0.5">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-red-800">{displayTitle}</h3>
        <p className="text-sm text-red-700 mt-0.5">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-red-700 hover:text-red-900 transition-colors"
          >
            {displayRetryLabel} →
          </button>
        )}
      </div>
    </div>
  );
};
