/**
 * useFiles Hook
 *
 * React hook for file operations.
 * Components should use this instead of calling API directly.
 * Delegates to the unified filesService.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { fileService } from "@/services/file-service";
import { logger } from "@/utils";
import type { FileSummary, FileType } from "@/types/api";

export interface UseFilesOptions {
  type: FileType | "all";
  page?: number;
  pageSize?: number;
  autoLoad?: boolean;
}

export interface UseFilesReturn {
  files: FileSummary[];
  loading: boolean;
  error: string | null;
  total: number;
  loadFiles: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFiles(options: UseFilesOptions): UseFilesReturn {
  const { type, page = 1, pageSize = 50, autoLoad = true } = options;
  const [files, setFiles] = useState<FileSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const allFiles: FileSummary[] = [];
      let totalCount = 0;

      // Determine which types to fetch
      const typesToFetch: FileType[] =
        type === "all"
          ? ["AIR", "OCEAN"]
          : [type.toUpperCase() as FileType];

      // Fetch files for each type
      for (const fileType of typesToFetch) {
        const response = await fileService.getFiles({
          type: fileType,
          page,
          pageSize,
        });

        if (response.files && Array.isArray(response.files)) {
          allFiles.push(...response.files);
          totalCount += response.total || 0;
        }
      }

      setFiles(allFiles);
      setTotal(totalCount);
    } catch (err: unknown) {
      logger.error("[useFiles] Failed to load files:", err);
      setError(err instanceof Error ? err.message : "Failed to load files");
      setFiles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [type, page, pageSize]);

  const refresh = loadFiles;

  // Auto-load on mount and when dependencies change
  useEffect(() => {
    if (autoLoad) {
      loadFiles();
    }
  }, [autoLoad, loadFiles]);

  return {
    files,
    loading,
    error,
    total,
    loadFiles,
    refresh,
  };
}
