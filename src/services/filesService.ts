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
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        });

        const query = queryParams.toString();
        const endpoint = query ? `/files?${query}` : "/files";

        return apiClient.get<GetFilesResponse>(endpoint);
    }

    /**
     * Get file details with sheet summaries
     */
    async getFileDetail(fileId: string): Promise<{ file: FileDetail }> {
        return apiClient.get<{ file: FileDetail }>(`/files/${fileId}`);
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
}

export const filesService = new FilesService();
