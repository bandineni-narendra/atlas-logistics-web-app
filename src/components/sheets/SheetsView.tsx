"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Loader2, Edit2, Copy, Trash2, AlertTriangle } from "lucide-react";
import { useFilesQuery, useDeleteFile } from "@/hooks/queries/useFiles";
import { Pagination } from "@/components/table/Pagination";
import { FILE_TYPE_CONFIG, FILE_STATUS_CONFIG } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { logger } from "@/utils/logger";
import { downloadFileAsXlsx } from "@/utils/downloadFile";
import { filesService } from "@/services/filesService";
import { Modal, Button } from "@/components/ui";
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
 * Sheets List View — Gmail-style dense list rows with Actions column
 */
export function SheetsView({
  filter = "all",
  page,
  onPageChange,
  startDate,
  endDate,
}: SheetsViewProps) {
  const t = useTranslations("sheetsView");
  const router = useRouter();

  /** Track which file ID is currently being downloaded */
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  /** Track which file ID is currently being copied */
  const [copyingId, setCopyingId] = useState<string | null>(null);
  /** File ID queued for deletion */
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string>("");

  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();

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

  const handleDownload = useCallback(
    async (e: React.MouseEvent, fileId: string, fileName: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (downloadingId) return;
      setDownloadingId(fileId);
      try {
        await downloadFileAsXlsx(fileId, fileName);
      } catch (err) {
        logger.error(`[SheetsView] Download failed for file ${fileId}:`, err);
      } finally {
        setDownloadingId(null);
      }
    },
    [downloadingId]
  );

  const handleCopy = useCallback(
    async (e: React.MouseEvent, fileId: string, fileType: FileType) => {
      e.preventDefault();
      e.stopPropagation();
      if (copyingId) return;
      setCopyingId(fileId);
      try {
        // Fetch sheets AND file detail in parallel — detail carries shipmentDetails
        const [{ sheets }, { file }] = await Promise.all([
          filesService.getFileSheets(fileId),
          filesService.getFileDetail(fileId),
        ]);
        // Store copy payload in sessionStorage; target page reads & consumes it
        sessionStorage.setItem(
          "atlas-copy-draft",
          JSON.stringify({
            fileType,
            shipmentDetails: file.shipmentDetails ?? null,
            sheets: sheets.map((s, i) => ({
              id: `copy-${Date.now()}-${i}`,
              name: s.name,
              rows: s.data.rows ?? [],
            })),
          })
        );
        router.push(fileType === "AIR" ? "/air-freight-sheet" : "/ocean-freight-sheet");
      } catch (err) {
        logger.error(`[SheetsView] Copy failed for file ${fileId}:`, err);
      } finally {
        setCopyingId(null);
      }
    },
    [copyingId, router]
  );

  const handleDeleteRequest = useCallback(
    (e: React.MouseEvent, fileId: string, fileName: string) => {
      e.preventDefault();
      e.stopPropagation();
      setPendingDeleteId(fileId);
      setPendingDeleteName(fileName);
    },
    []
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!pendingDeleteId) return;
    deleteFile(pendingDeleteId, {
      onSuccess: () => {
        setPendingDeleteId(null);
        setPendingDeleteName("");
      },
      onError: (err) => {
        logger.error(`[SheetsView] Delete failed for file ${pendingDeleteId}:`, err);
        setPendingDeleteId(null);
        setPendingDeleteName("");
      },
    });
  }, [pendingDeleteId, deleteFile]);

  const handleDeleteCancel = useCallback(() => {
    setPendingDeleteId(null);
    setPendingDeleteName("");
  }, []);

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
      {/* Table header — mirrors the exact flex structure of each row */}
      <div className="hidden sm:flex items-center border-b border-border bg-surface text-xs font-medium text-textSecondary">
        {/* Matches <Link> in rows exactly: px-4 py-2 gap-4 flex-1 */}
        <div className="flex-1 flex items-center gap-4 px-3 py-2 min-w-0">
          {/* Matches row's gap-3 icon + text group */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="w-8 flex-shrink-0" />{/* icon spacer */}
            <div className="flex flex-1 min-w-0">
              <span className="w-[55%]">Name</span>
              <span className="w-[45%]">{t("table.client") || "Client"}</span>
            </div>
          </div>
          {/* Fixed-width columns matching row divs exactly */}
          <span className="w-20 flex-shrink-0">{t("table.type")}</span>
          <span className="w-24 flex-shrink-0">{t("table.status")}</span>
          <span className="w-24 flex-shrink-0 text-right">{t("table.updated")}</span>
        </div>
        {/* Matches row's w-36 actions cell (outside the px-4 link area) */}
        <span className="w-36 flex-shrink-0 text-center py-2 px-2">{t("table.actions")}</span>
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

          const isDownloading = downloadingId === file.id;
          const isCopying = copyingId === file.id;

          return (
            <li
              key={file.id}
              className="group flex items-center hover:bg-surface transition-colors duration-100"
            >
              {/* Clickable link area — covers all data columns */}
              <Link
                href={ROUTES.FILE_DETAIL(file.id)}
                className="flex-1 flex items-center gap-4 px-3 py-2.5 min-w-0"
              >
                {/* Name + Client: single left cell, rendered as two inline sub-columns */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-lg ${typeInfo.color} flex items-center justify-center text-sm`}
                  >
                    {typeInfo.icon}
                  </span>
                  {/* Name takes 55%, Client takes 45% of this cell */}
                  <div className="flex min-w-0 flex-1">
                    <span className="w-[55%] truncate font-medium text-textPrimary text-sm group-hover:text-primary transition-colors duration-100 pr-2">
                      {file.name}
                    </span>
                    <span className="w-[45%] truncate text-sm text-textSecondary">
                      {file.clientEmail || <span className="opacity-30">—</span>}
                    </span>
                  </div>
                </div>

                {/* Type */}
                <div className="w-20 flex-shrink-0">
                  <span className={`text-sm font-medium ${typeInfo.textColor}`}>
                    {typeInfo.label}
                  </span>
                </div>

                {/* Status badge */}
                <div className="w-24 flex-shrink-0">
                  <span
                    className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Updated date */}
                <div className="w-24 flex-shrink-0 text-right text-xs text-textSecondary">
                  {new Date(file.updatedAt).toLocaleDateString()}
                </div>
              </Link>

              {/* Actions cell — outside the Link so clicks don't navigate */}
              <div className="w-36 flex-shrink-0 flex items-center justify-center px-2 py-2.5">
                <div className="flex items-center justify-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Edit button */}
                  <Link
                    href={`/files/${file.id}/edit`}
                    className="p-1.5 text-textSecondary hover:text-primary hover:bg-primary-soft rounded-md transition-all duration-200 hover:scale-110 flex items-center justify-center"
                    title="Edit File"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>

                  {/* Download button */}
                  <button
                    onClick={(e) => handleDownload(e, file.id, file.name)}
                    disabled={isDownloading}
                    className="p-1.5 text-textSecondary hover:text-primary hover:bg-primary-soft rounded-md transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    title="Download as Excel"
                    type="button"
                    aria-label={`Download ${file.name} as Excel`}
                  >
                    {isDownloading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Copy button */}
                  <button
                    onClick={(e) => handleCopy(e, file.id, file.type)}
                    disabled={!!copyingId}
                    className="p-1.5 text-textSecondary hover:text-primary hover:bg-primary-soft rounded-md transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    title="Copy as new file"
                    type="button"
                    aria-label={`Copy ${file.name}`}
                  >
                    {isCopying ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteRequest(e, file.id, file.name)}
                    className="p-1.5 text-textSecondary hover:text-error hover:bg-error/10 rounded-md transition-all duration-200 hover:scale-110"
                    title="Delete file"
                    type="button"
                    aria-label={`Delete ${file.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
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

      {/* ── Delete Confirm Modal ─────────────────────────── */}
      <Modal
        isOpen={!!pendingDeleteId}
        onClose={handleDeleteCancel}
        maxWidth="max-w-sm"
        preventBackdropClose={isDeleting}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-textPrimary">Delete File</h3>
              <p className="text-xs text-textSecondary mt-0.5">This action cannot be undone.</p>
            </div>
          </div>
          <p className="text-sm text-textSecondary mb-6">
            Are you sure you want to delete{" "}
            <span className="font-medium text-textPrimary">&ldquo;{pendingDeleteName}&rdquo;</span>?
            All sheets and rows will be permanently removed.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
