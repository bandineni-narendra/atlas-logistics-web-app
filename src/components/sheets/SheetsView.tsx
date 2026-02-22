"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useFilesQuery } from "@/hooks/queries/useFiles";
import { Pagination } from "@/components/table/Pagination";
import { FILE_TYPE_CONFIG, FILE_STATUS_CONFIG } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { logger } from "@/utils/logger";
import { useTranslations } from "next-intl";
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
 * Sheets List View — Gmail-style dense list rows
 */
export function SheetsView({
  filter = "all",
  page,
  onPageChange,
  startDate,
  endDate,
}: SheetsViewProps) {
  const t = useTranslations("sheetsView");

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
      return t("empty.messageAirOcean");
    }
    return t("empty.messageSpecific", { type: filter });
  }, [filter, t]);

  logger.debug(
    `[SheetsView] filter="${filter}", page=${page}, total=${total}, files=${files.length}, loading=${isLoading}`
  );

  // ── Loading ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-center">
          <div className="relative inline-block w-8 h-8 mb-2">
            <div className="w-8 h-8 border-[3px] border-surface rounded-full" />
            <div className="absolute top-0 left-0 w-8 h-8 border-[3px] border-primary rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-textSecondary">Loading files...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────
  if (isError) {
    return (
      <div className="bg-error rounded-xl p-4">
        <p className="text-sm text-white">
          <span className="font-medium">Error:</span>{" "}
          {error instanceof Error ? error.message : "Failed to load files"}
        </p>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────
  if (files.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-textPrimary text-base font-medium">{t("empty.title")}</p>
        <p className="text-sm text-textSecondary mt-1">{emptyStateMessage}</p>
      </div>
    );
  }

  // ── List View ──────────────────────────────────────────
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-surface">
      {/* Table header */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-textSecondary border-b border-border bg-surface">
        <span className="col-span-5">{t("table.name")}</span>
        <span className="col-span-2">{t("table.type")}</span>
        <span className="col-span-2">{t("table.status")}</span>
        <span className="col-span-1 text-center">{t("table.sheets")}</span>
        <span className="col-span-2 text-right">{t("table.updated")}</span>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-border">
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
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-4 py-2.5 hover:bg-surface transition-colors duration-100 group"
              >
                {/* Name + icon */}
                <div className="sm:col-span-5 flex items-center gap-3 min-w-0">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-lg ${typeInfo.color} flex items-center justify-center text-sm`}
                  >
                    {typeInfo.icon}
                  </span>
                  <span className="truncate font-medium text-textPrimary text-sm group-hover:text-primary transition-colors duration-100">
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
                <div className="sm:col-span-1 text-center text-sm text-textPrimary font-medium">
                  {file.sheetCount}
                </div>

                {/* Updated date */}
                <div className="sm:col-span-2 text-right text-xs text-textSecondary">
                  {new Date(file.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Pagination */}
      <div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-border">
          <p className="text-sm text-textSecondary">
            {t("pagination.showing")}{" "}
            <span className="font-medium text-textPrimary">
              {(page - 1) * PAGE_SIZE + 1}
            </span>
            –
            <span className="font-medium text-textPrimary">
              {Math.min(page * PAGE_SIZE, total)}
            </span>{" "}
            {t("pagination.of")}{" "}
            <span className="font-medium text-textPrimary">{total}</span>
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
