/**
 * File Domain Types
 *
 * Represents a File entity (like an Excel workbook) that contains multiple sheets.
 * A File is the aggregate root - all sheets belong to a single File.
 */

/**
 * File type discriminator
 */
export type FileType = "AIR" | "OCEAN";

/**
 * File status lifecycle
 */
export type FileStatus = "draft" | "saved" | "archived";

/**
 * Core File entity
 * This is the aggregate root for sheets
 */
export interface File {
  /** Unique file identifier */
  id: string;

  /** Organization ID this file belongs to */
  orgId: string;

  /** User-defined file name (required) */
  name: string;

  /** File type (AIR or OCEAN freight) */
  type: FileType;

  /** Effective date for this freight data */
  effectiveDate: string;

  /** Number of sheets in this file */
  sheetCount: number;

  /** Current status of the file */
  status: FileStatus;

  /** When the file was created */
  createdAt: Date;

  /** When the file was last updated */
  updatedAt: Date;

  /** User who created the file */
  createdBy: string;
}

/**
 * File summary for list views (without full sheet data)
 */
export interface FileSummary {
  id: string;
  orgId: string;
  name: string;
  type: FileType;
  effectiveDate: string;
  sheetCount: number;
  status: FileStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/**
 * File with full details including sheets
 */
export interface FileDetail extends FileSummary {
  sheets: Array<{
    id: string;
    name: string;
    rowCount: number;
  }>;
}

/**
 * File metadata for creation
 */
export interface FileMetadata {
  name: string;
  type: FileType;
  effectiveDate: string;
  orgId: string;
}

/**
 * File query filters
 */
export interface FileQueryFilters {
  type?: FileType;
  status?: FileStatus;
  startDate?: string;
  endDate?: string;
  orgId?: string;
}
