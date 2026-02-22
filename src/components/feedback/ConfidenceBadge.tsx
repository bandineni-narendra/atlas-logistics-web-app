"use client";

import React from "react";
import { useTranslations } from "next-intl";

export interface ConfidenceBadgeProps {
  confidence: number;
}

/**
 * Displays confidence as a progress bar with percentage
 */
export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
}) => {
  const t = useTranslations();
  const confidencePercent = Math.round(confidence * 100);
  const confidenceColor =
    confidencePercent >= 80
      ? "text-success"
      : confidencePercent >= 60
        ? "text-warning"
        : "text-error";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-textSecondary">{t("ocean.confidence")}:</span>
      <div className="flex items-center gap-2">
        <div className="w-32 h-2 bg-[var(--surface-container-highest)] rounded-full overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <span className={`text-sm font-semibold ${confidenceColor}`}>
          {confidencePercent}%
        </span>
      </div>
    </div>
  );
};
