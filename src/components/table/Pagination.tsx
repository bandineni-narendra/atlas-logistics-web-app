"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDisabled?: boolean;
};

/**
 * Reusable pagination controls
 * Shows previous/next buttons and page info
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
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
      <div className="text-sm text-gray-500">
        {t("common.page")}{" "}
        <span className="font-medium text-gray-700">{currentPage}</span>{" "}
        {t("common.of")}{" "}
        <span className="font-medium text-gray-700">{totalPages}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious || isDisabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("buttons.previous")}
        </button>

        <button
          onClick={handleNext}
          disabled={!hasNext || isDisabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
        >
          {t("buttons.next")}
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
