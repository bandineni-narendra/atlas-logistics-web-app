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

  return (
    <p className="text-sm text-gray-600">
      {displayLabel} {completed} {t("common.of")} {total} {t("common.sheets")}
    </p>
  );
};
