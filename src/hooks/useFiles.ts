/**
 * useFiles Hook
 *
 * React hook for file operations.
 * Components should use this instead of calling API directly.
 * Delegates to the unified filesService.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { filesService } from "@/services/filesService";
import type { FileSummary, FileType } from "@/types/api";

export interface UseFilesOptions {
  type: FileType | "all";
  page?: number;
  pageSize?: number;
  autoLoad?: boolean; // Kept for interface backward compatibility, though React Query handles enabled state natively
}

export interface UseFilesReturn {
  files: FileSummary[];
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  total: number;
  loadFiles: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFiles({
  type,
  page = 1,
  pageSize = 50,
  autoLoad = true
}: UseFilesOptions): UseFilesReturn {
  const query = useQuery({
    queryKey: ["files", type, page, pageSize],
    queryFn: async () => {
      const typesToFetch: FileType[] =
        type === "all" ? ["AIR", "OCEAN"] : [type.toUpperCase() as FileType];

      const allFiles: FileSummary[] = [];
      let totalCount = 0;

      // Fetch files for each type concurrently using Promise.all
      const responses = await Promise.all(
        typesToFetch.map((fileType) =>
          filesService.getFiles({ type: fileType, page, pageSize })
        )
      );

      for (const response of responses) {
        if (response.files && Array.isArray(response.files)) {
          allFiles.push(...response.files);
          totalCount += response.total || 0;
        }
      }

      return { files: allFiles, total: totalCount };
    },
    enabled: autoLoad, // Only run the query automatically if autoLoad is true
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return {
    files: query.data?.files || [],
    loading: query.isLoading, // Backward compatibility alias
    isLoading: query.isLoading,
    error: query.error,
    total: query.data?.total || 0,
    // Provide Promise-based aliases for backward compatibility with consumers expecting imperitave fetches
    loadFiles: async () => {
      await query.refetch();
    },
    refresh: async () => {
      await query.refetch();
    },
  };
}
