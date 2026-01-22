"use client";

import { useCallback } from "react";

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
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious || isDisabled}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!hasNext || isDisabled}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
