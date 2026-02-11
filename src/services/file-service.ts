/**
 * File Service
 * 
 * Application layer service for file operations.
 * Components should use this instead of calling API clients directly.
 */

import { FileType, FileSummary, FileDetail } from "@/types/file";
import { 
  getFiles as getFilesAPI,
  getFileDetail as getFileDetailAPI,
  deleteFile as deleteFileAPI,
  createFile as createFileAPI,
  updateFile as updateFileAPI,
  getFileDashboardStats as getDashboardStatsAPI,
} from "@/api/files_client";
import {
  CreateFileRequest,
  UpdateFileRequest,
  GetFilesRequest,
} from "@/types/api/files";

export class FileService {
  /**
   * Get files with pagination and filters
   */
  async getFiles(params: GetFilesRequest): Promise<{ items: FileSummary[]; total: number }> {
    const response = await getFilesAPI(params);
    return {
      items: response.items || [],
      total: response.total || 0,
    };
  }

  /**
   * Get files by type (helper method)
   */
  async getFilesByType(
    type: FileType,
    page: number = 1,
    pageSize: number = 50
  ): Promise<FileSummary[]> {
    const response = await this.getFiles({ type, page, pageSize });
    return response.items;
  }

  /**
   * Get detailed file information
   */
  async getFileDetail(id: string, type: FileType): Promise<FileDetail> {
    const response = await getFileDetailAPI(id, type);
    return response.file;
  }

  /**
   * Create a new file
   */
  async createFile(data: CreateFileRequest): Promise<{ fileId: string; sheetIds: string[] }> {
    const response = await createFileAPI(data);
    return {
      fileId: response.fileId,
      sheetIds: response.sheetIds,
    };
  }

  /**
   * Update file metadata
   */
  async updateFile(id: string, type: FileType, data: UpdateFileRequest): Promise<void> {
    await updateFileAPI(id, type, data);
  }

  /**
   * Delete a file
   */
  async deleteFile(id: string, type: FileType): Promise<void> {
    await deleteFileAPI(id, type);
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(type: FileType): Promise<{
    totalFiles: number;
    totalSheets: number;
    totalRows: number;
    lastModified: string;
  }> {
    const response = await getDashboardStatsAPI(type);
    return response.stats;
  }
}

// Export singleton instance
export const fileService = new FileService();
