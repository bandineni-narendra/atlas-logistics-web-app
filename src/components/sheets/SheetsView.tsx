"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useFilesQuery } from "@/hooks/queries/useFiles";
import { Pagination } from "@/components/table/Pagination";
import { FILE_TYPE_CONFIG, FILE_STATUS_CONFIG, ROUTES } from "@/constants";
import { logger } from "@/utils";
import type { FileType } from "@/types/api";

const PAGE_SIZE = 10;

export interface SheetsViewProps {
  filter?: "ocean" | "air" | "all";
  page: number;
  onPageChange: (page: number) => void;
  startDate?: string;
  endDate?: string;
}

/**
 * Sheets List View
 * Displays files as a paginated list with server-side pagination.
 * Uses React Query (useFilesQuery) for data fetching.
 */
export function SheetsView({
  filter = "all",
  page,
  onPageChange,
  startDate,
  endDate,
}: SheetsViewProps) {
  // Build query params — omit type when "all", include date range if provided
  const queryParams = useMemo(
    () => ({
      ...(filter !== "all" && {
        type: filter.toUpperCase() as FileType,
      }),
      page,
      pageSize: PAGE_SIZE,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    }),
    [filter, page, startDate, endDate]
  );

  const { data, isLoading, isError, error } = useFilesQuery(queryParams);

  const files = data?.files ?? [];
  const total = data?.total ?? 0;

  // Empty-state message
  const emptyStateMessage = useMemo(() => {
    if (filter === "all") {
      return "Create a new Air or Ocean freight file to get started";
    }
    return `Create a new ${filter} freight file to get started`;
  }, [filter]);

  logger.debug(
    `[SheetsView] filter="${filter}", page=${page}, total=${total}, files=${files.length}, loading=${isLoading}`
  );

  // ── Loading ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          <span className="font-semibold">Error:</span>{" "}
          {error instanceof Error ? error.message : "Failed to load files"}
        </p>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg font-medium">No files found</p>
        <p className="text-sm text-gray-400 mt-2">{emptyStateMessage}</p>
      </div>
    );
  }

  // ── List View ──────────────────────────────────────────
  return (
    <div>
      {/* Table header */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
        <span className="col-span-5">Name</span>
        <span className="col-span-2">Type</span>
        <span className="col-span-2">Status</span>
        <span className="col-span-1 text-center">Sheets</span>
        <span className="col-span-2 text-right">Updated</span>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-gray-100">
        {files.map((file) => {
          const fileTypeKey =
            file.type.toLowerCase() as keyof typeof FILE_TYPE_CONFIG;
          const typeInfo = FILE_TYPE_CONFIG[fileTypeKey];
          const statusInfo = FILE_STATUS_CONFIG[file.status];

          if (!typeInfo || !statusInfo) {
            logger.warn(
              `[SheetsView] Unknown type/status: ${file.type}/${file.status}`
            );
            return null;
          }

          return (
            <li key={file.id}>
              <Link
                href={ROUTES.FILE_DETAIL(file.id)}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                {/* Name + icon */}
                <div className="sm:col-span-5 flex items-center gap-3 min-w-0">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-lg ${typeInfo.color} flex items-center justify-center text-sm`}
                  >
                    {typeInfo.icon}
                  </span>
                  <span className="truncate font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {file.name}
                  </span>
                </div>

                {/* Type */}
                <div className="sm:col-span-2">
                  <span
                    className={`text-sm font-medium ${typeInfo.textColor}`}
                  >
                    {typeInfo.label}
                  </span>
                </div>

                {/* Status badge */}
                <div className="sm:col-span-2">
                  <span
                    className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Sheet count */}
                <div className="sm:col-span-1 text-center text-sm text-gray-700 font-semibold">
                  {file.sheetCount}
                </div>

                {/* Updated date */}
                <div className="sm:col-span-2 text-right text-xs text-gray-500">
                  {new Date(file.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Pagination */}
      <div className="mt-4">
        <div className="flex items-center justify-between px-4 py-2">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {(page - 1) * PAGE_SIZE + 1}
            </span>
            –
            <span className="font-medium text-gray-900">
              {Math.min(page * PAGE_SIZE, total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">{total}</span>
          </p>
        </div>
        <Pagination
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
