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
      ? "text-green-600"
      : confidencePercent >= 60
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">{t("ocean.confidence")}:</span>
      <div className="flex items-center gap-2">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
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
