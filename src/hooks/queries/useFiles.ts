/**
 * React Query Files Hooks
 *
 * Query and mutation hooks for file CRUD operations.
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { filesService } from "@/services/filesService";
import type {
  CreateFileRequest,
  GetFilesParams,
  UpdateFileRequest,
  GetSheetRowsParams,
} from "@/types/api";

/**
 * Fetch paginated files with optional filters
 */
export function useFilesQuery(params: GetFilesParams = {}) {
  return useQuery({
    queryKey: ["files", params],
    queryFn: () => filesService.getFiles(params),
  });
}

/**
 * Fetch single file detail
 */
export function useFileDetail(fileId: string) {
  return useQuery({
    queryKey: ["files", fileId],
    queryFn: () => filesService.getFileDetail(fileId),
    enabled: !!fileId,
  });
}

/**
 * Fetch all sheets with full data for a file
 */
export function useFileSheets(fileId: string) {
  return useQuery({
    queryKey: ["files", fileId, "sheets"],
    queryFn: () => filesService.getFileSheets(fileId),
    enabled: !!fileId,
  });
}

/**
 * Create a new file with sheets
 */
export function useCreateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFileRequest) => filesService.createFile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

/**
 * Update file metadata
 */
export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, data }: { fileId: string; data: UpdateFileRequest }) =>
      filesService.updateFile(fileId, data),
    onSuccess: (_, { fileId }) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["files", fileId] });
    },
  });
}

/**
 * Delete a file and all its sheets
 */
export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => filesService.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

/**
 * Fetch paginated rows for a sheet
 */
export function useSheetRows(
  fileId: string,
  sheetId: string,
  params: GetSheetRowsParams = {},
) {
  return useQuery({
    queryKey: ["files", fileId, "sheets", sheetId, "rows", params],
    queryFn: () => filesService.getSheetRows(fileId, sheetId, params),
    enabled: !!fileId && !!sheetId,
  });
}
