/**
 * Files Service
 *
 * Typed service for the unified Files API.
 * All file types (AIR/OCEAN) go through the same /files endpoint.
 */

import { apiClient } from "./apiClient";
import type {
    CreateFileRequest,
    CreateFileResponse,
    GetFilesParams,
    GetFilesResponse,
    FileDetail,
    UpdateFileRequest,
    UpdateFileResponse,
    DeleteFileResponse,
    SheetWithData,
    GetSheetRowsParams,
    GetSheetRowsResponse,
} from "@/types/api";

export class FilesService {
    /**
     * Create a new file with sheets
     */
    async createFile(data: CreateFileRequest): Promise<CreateFileResponse> {
        return apiClient.post<CreateFileResponse>("/files", data);
    }

    /**
     * Get paginated list of files with optional filters
     */
    async getFiles(params: GetFilesParams = {}): Promise<GetFilesResponse> {
        const queryParams: Record<string, string | number> = {};

        if (params.type) queryParams.type = params.type;
        if (params.page !== undefined) queryParams.page = params.page;
        if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize;
        if (params.status) queryParams.status = params.status;

        return apiClient.get<GetFilesResponse>("/files", queryParams);
    }

    /**
     * Get file details with sheet summaries
     */
    async getFileDetail(fileId: string): Promise<{ file: FileDetail }> {
        return apiClient.get<{ file: FileDetail }>(`/files/${fileId}`);
    }

    /**
     * Get all sheets with full data for a file
     */
    async getFileSheets(fileId: string): Promise<{ sheets: SheetWithData[] }> {
        return apiClient.get<{ sheets: SheetWithData[] }>(`/files/${fileId}/sheets`);
    }

    /**
     * Update file metadata
     */
    async updateFile(fileId: string, data: UpdateFileRequest): Promise<UpdateFileResponse> {
        return apiClient.put<UpdateFileResponse>(`/files/${fileId}`, data);
    }

    /**
     * Delete file and all its sheets
     */
    async deleteFile(fileId: string): Promise<DeleteFileResponse> {
        return apiClient.delete<DeleteFileResponse>(`/files/${fileId}`);
    }

    /**
     * Get paginated rows for a sheet
     */
    async getSheetRows(
        fileId: string,
        sheetId: string,
        params: GetSheetRowsParams = {},
    ): Promise<GetSheetRowsResponse> {
        const queryParams: Record<string, string | number> = {};

        if (params.page !== undefined) queryParams.page = params.page;
        if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize;

        return apiClient.get<GetSheetRowsResponse>(
            `/files/${fileId}/sheets/${sheetId}/rows`,
            queryParams,
        );
    }
}

export const filesService = new FilesService();
