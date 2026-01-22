import { useState, useCallback, useMemo } from "react";

export type UsePaginationOptions = {
  initialPage?: number;
  pageSize?: number;
};

export type UsePaginationReturn = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  reset: () => void;
};

/**
 * Reusable pagination hook
 * Manages pagination state and calculations
 */
export function usePagination(
  totalItems: number,
  options: UsePaginationOptions = {},
): UsePaginationReturn {
  const { initialPage = 1, pageSize = 10 } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / pageSize);

  // Clamp page to valid range
  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  return useMemo(
    () => ({
      currentPage: validPage,
      pageSize,
      totalPages,
      startIndex,
      endIndex,
      onPageChange,
      reset,
    }),
    [
      validPage,
      pageSize,
      totalPages,
      startIndex,
      endIndex,
      onPageChange,
      reset,
    ],
  );
}
