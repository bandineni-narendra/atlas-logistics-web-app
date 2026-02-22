"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDisabled?: boolean;
};

/**
 * Pagination — M3 outlined pill buttons
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isDisabled = false,
}: PaginationProps) {
  const t = useTranslations();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handlePrevious = useCallback(
    () => onPageChange(currentPage - 1),
    [onPageChange, currentPage],
  );

  const handleNext = useCallback(
    () => onPageChange(currentPage + 1),
    [onPageChange, currentPage],
  );

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--outline-variant)]">
      <div className="text-sm text-[var(--on-surface-variant)]">
        {t("common.page")}{" "}
        <span className="font-medium text-[var(--on-surface)]">{currentPage}</span>{" "}
        {t("common.of")}{" "}
        <span className="font-medium text-[var(--on-surface)]">{totalPages}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious || isDisabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--on-surface-variant)] bg-[var(--surface)] border border-[var(--outline)] rounded-full hover:bg-[var(--surface-container-low)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-100"
        >
          <ChevronLeft className="w-4 h-4" />
          {t("buttons.previous")}
        </button>

        <button
          onClick={handleNext}
          disabled={!hasNext || isDisabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--on-surface-variant)] bg-[var(--surface)] border border-[var(--outline)] rounded-full hover:bg-[var(--surface-container-low)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-100"
        >
          {t("buttons.next")}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
