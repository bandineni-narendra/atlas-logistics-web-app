"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2 } from "lucide-react";

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
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${isComplete
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
          }`}
      >
        {isComplete ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        )}
        {displayLabel} {completed} {t("common.of")} {total} {t("common.sheets")}
      </span>
    </div>
  );
};
