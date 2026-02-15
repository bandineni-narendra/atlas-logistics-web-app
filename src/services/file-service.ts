/**
 * File Service
 *
 * Application layer service for file operations.
 * Components should use this instead of calling API clients directly.
 * Now delegates to the unified filesService.
 */

import { FileSummary as ApiFileSummary, FileDetail as ApiFileDetail } from "@/types/api";
import { filesService } from "@/services/filesService";
import type {
  CreateFileRequest,
  UpdateFileRequest,
  GetFilesParams,
} from "@/types/api";

export class FileService {
  /**
   * Get files with pagination and filters
   */
  async getFiles(params: GetFilesParams): Promise<{ files: ApiFileSummary[]; total: number }> {
    const response = await filesService.getFiles(params);
    return {
      files: response.files || [],
      total: response.total || 0,
    };
  }

  /**
   * Get files by type (helper method)
   */
  async getFilesByType(
    type: "AIR" | "OCEAN",
    page: number = 1,
    pageSize: number = 50,
  ): Promise<ApiFileSummary[]> {
    const response = await this.getFiles({ type, page, pageSize });
    return response.files;
  }

  /**
   * Get detailed file information
   */
  async getFileDetail(id: string): Promise<ApiFileDetail> {
    const response = await filesService.getFileDetail(id);
    return response.file;
  }

  /**
   * Create a new file
   */
  async createFile(data: CreateFileRequest): Promise<{ fileId: string; sheetIds: string[] }> {
    const response = await filesService.createFile(data);
    return {
      fileId: response.fileId,
      sheetIds: response.sheetIds,
    };
  }

  /**
   * Update file metadata
   */
  async updateFile(id: string, data: UpdateFileRequest): Promise<void> {
    await filesService.updateFile(id, data);
  }

  /**
   * Delete a file
   */
  async deleteFile(id: string): Promise<void> {
    await filesService.deleteFile(id);
  }
}

// Export singleton instance
export const fileService = new FileService();
