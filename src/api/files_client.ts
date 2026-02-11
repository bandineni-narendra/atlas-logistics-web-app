/**
 * File API Client - Domain Separated (Air & Ocean)
 *
 * Handles all file-related API calls with separate endpoints for each freight type.
 * Files are the aggregate root - they contain multiple sheets.
 *
 * Air Freight Endpoints (Base: /api/air):
 * - POST /api/air/files - Create air freight file with sheets
 * - GET /api/air/files - List air freight files with pagination/filters
 * - GET /api/air/files/:id - Get air freight file detail with sheets
 * - PUT /api/air/files/:id - Update air freight file metadata
 * - DELETE /api/air/files/:id - Delete air freight file and all its sheets
 * - GET /api/air/dashboard/stats - Get air freight dashboard statistics
 *
 * Ocean Freight Endpoints (Base: /api/ocean):
 * - POST /api/ocean/files - Create ocean freight file with sheets
 * - GET /api/ocean/files - List ocean freight files with pagination/filters
 * - GET /api/ocean/files/:id - Get ocean freight file detail with sheets
 * - PUT /api/ocean/files/:id - Update ocean freight file metadata
 * - DELETE /api/ocean/files/:id - Delete ocean freight file and all its sheets
 * - GET /api/ocean/dashboard/stats - Get ocean freight dashboard statistics
 */

import { FileType } from "@/types/file";
import {
  CreateFileRequest,
  CreateFileResponse,
  GetFilesRequest,
  GetFilesResponse,
  GetFileDetailResponse,
  UpdateFileRequest,
  UpdateFileResponse,
  DeleteFileResponse,
  GetFileDashboardStatsResponse,
} from "@/types/api/files";
import { TokenProvider } from "@/services/auth/TokenProvider";
import { firebaseTokenProvider } from "@/infrastructure/firebase";
import { logger } from "@/utils";

// Use relative path - Next.js will rewrite to backend API
const API_URL = "/api";

// Use dependency injection for token provider
let tokenProvider: TokenProvider = firebaseTokenProvider;

/**
 * Set custom token provider (for testing)
 */
export function setTokenProvider(provider: TokenProvider) {
  tokenProvider = provider;
}

/**
 * Get base API path for a given file type
 */
function getBasePath(fileType: FileType): string {
  return fileType === "AIR" ? "/api/air" : "/api/ocean";
}

/**
 * Backend Column Type (subset of frontend types)
 */
type BackendColumnType = "text" | "number" | "select";

/**
 * Backend Column structure (stripped down for API)
 */
interface BackendColumn {
  id: string;
  label: string;
  type: BackendColumnType;
  options?: string[];
}

/**
 * Transform frontend column to backend format
 * Removes UI-only properties and converts types
 */
function transformColumn(column: any): BackendColumn {
  // Map frontend types to backend types
  let backendType: BackendColumnType = "text";

  switch (column.type) {
    case "text":
    case "date": // Backend doesn't support date, use text
    case "boolean": // Backend doesn't support boolean, use text
      backendType = "text";
      break;
    case "number":
      backendType = "number";
      break;
    case "select":
      backendType = "select";
      break;
    default:
      backendType = "text";
  }

  const result: BackendColumn = {
    id: column.id,
    label: column.label,
    type: backendType,
  };

  // Transform options from { label, value } objects to string array
  if (column.options && Array.isArray(column.options)) {
    result.options = column.options.map((opt: any) =>
      typeof opt === "string" ? opt : opt.value?.toString() || opt.label,
    );
  }

  return result;
}

/**
 * Transform CreateFileRequest to match backend expectations
 * Removes orgId (extracted from JWT) and type (implicit in endpoint URL)
 * Transforms column definitions to backend format
 */
function transformCreateFileRequest(request: CreateFileRequest): any {
  const { orgId, type, ...requestWithoutOrgIdAndType } = request;

  return {
    ...requestWithoutOrgIdAndType,
    sheets: request.sheets.map(
      (sheet: CreateFileRequest["sheets"][number]) => ({
        name: sheet.name,
        data: {
          id: sheet.data.id,
          name: sheet.data.name,
          columns: sheet.data.columns.map(transformColumn),
          rows: sheet.data.rows,
        },
      }),
    ),
  };
}

/**
 * Get authentication token via provider
 * Forces token refresh to ensure custom claims (orgId) are included
 */
async function getAuthToken(): Promise<string> {
  // Force refresh to get latest custom claims from backend
  const token = await tokenProvider.getToken(true);
  
  if (!token) {
    throw new Error("User not authenticated");
  }

  // Debug: Log token payload to verify orgId is present
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    logger.debug("[files_client] Token claims:", {
      userId: payload.user_id || payload.userId,
      email: payload.email,
      hasOrgId: !!(payload.orgId || payload.org_id || payload.organizationId),
    });

    if (!payload.orgId && !payload.org_id && !payload.organizationId) {
      logger.error("[files_client] ⚠️ orgId missing from token!");
      logger.error("[files_client] Available claims:", Object.keys(payload));

      throw new Error(
        "Organization ID not found in authentication token. " +
          "Please logout and login again. If the issue persists, contact support.",
      );
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("Organization ID")) {
      throw e; // Re-throw our custom error
    }
    logger.error("[files_client] Failed to parse token:", e);
  }

  return token;
}

/**
 * API Error class for structured error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: string[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Make authenticated API request
 * Handles token injection, error handling, and response parsing
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = await getAuthToken();

  // WORKAROUND: Get orgId from localStorage if not in token
  const storedOrgId =
    typeof window !== "undefined" ? localStorage.getItem("user_orgId") : null;

  logger.debug(`[apiRequest] Fetching ${API_URL}${endpoint}`);

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(storedOrgId ? { "X-Organization-Id": storedOrgId } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "An error occurred",
    }));
    throw new ApiError(
      error.error || error.message || "Request failed",
      response.status,
      error.details,
    );
  }

  const jsonResponse = await response.json();
  logger.debug(`[apiRequest] ${endpoint} - Status: ${response.status}`);

  return jsonResponse;
}

/**
 * Create a new file with all its sheets
 * Routes to appropriate endpoint based on file type (AIR or OCEAN)
 * This is the primary save operation for the Sheet Builder
 *
 * @param data - File metadata and sheets
 * @returns File ID and sheet IDs
 */
export async function createFile(
  data: CreateFileRequest,
): Promise<CreateFileResponse> {
  // Transform data to match backend expectations
  const transformedData = transformCreateFileRequest(data);

  // Route to domain-specific endpoint
  const basePath = getBasePath(data.type);

  return apiRequest<CreateFileResponse>(`${basePath}/files`, {
    method: "POST",
    body: JSON.stringify(transformedData),
  });
}

/**
 * Get files with pagination and filters
 * Routes to appropriate endpoint based on file type (AIR or OCEAN)
 *
 * @param params - Query parameters for filtering and pagination (must include type)
 * @returns Paginated list of file summaries
 */
export async function getFiles(
  params: GetFilesRequest,
): Promise<GetFilesResponse> {
  if (!params.type) {
    throw new Error("File type (AIR or OCEAN) is required for getFiles");
  }

  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.pageSize) searchParams.set("pageSize", params.pageSize.toString());
  if (params.status) searchParams.set("status", params.status);
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);

  // Route to domain-specific endpoint
  const basePath = getBasePath(params.type);
  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `${basePath}/files?${queryString}`
    : `${basePath}/files`;

  try {
    logger.debug(`[getFiles] Requesting: ${API_URL}${endpoint}`);

    const response = await apiRequest<GetFilesResponse>(endpoint);

    logger.debug(`[getFiles(${params.type})] Response structure:`, {
      hasItems: !!response?.items,
      itemsLength: response?.items?.length,
      total: response?.total,
      page: response?.page,
    });

    // Ensure response has expected structure
    if (!response || !response.items) {
      logger.warn(`[getFiles(${params.type})] Response missing items, returning empty`);

      // DEVELOPMENT ONLY: If response is empty, return mock data for testing
      // This should be removed once backend has actual data
      if (!response?.items || response.items.length === 0) {
        logger.warn(`[getFiles(${params.type})] API returned empty items - using mock data for testing`);
        return {
          items: [
            {
              id: `mock-${params.type}-1`,
              orgId: "test-org",
              name: `Sample ${params.type === "AIR" ? "Air" : "Ocean"} Freight - 1`,
              type: params.type,
              effectiveDate: new Date().toISOString().split("T")[0],
              sheetCount: 3,
              status: "saved",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: "test-user",
            },
            {
              id: `mock-${params.type}-2`,
              orgId: "test-org",
              name: `Sample ${params.type === "AIR" ? "Air" : "Ocean"} Freight - 2`,
              type: params.type,
              effectiveDate: new Date().toISOString().split("T")[0],
              sheetCount: 5,
              status: "draft",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: "test-user",
            },
          ] as any,
          total: 2,
          page: params.page || 1,
          pageSize: params.pageSize || 50,
        };
      }

      return {
        items: [],
        total: 0,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      };
    }

    return response;
  } catch (error) {
    logger.error(`[getFiles(${params.type})] Error:`, {
      message: error instanceof Error ? error.message : String(error),
      endpoint,
    });
    throw error;
  }
}

/**
 * Get a single file by ID with full details
 * Routes to appropriate endpoint based on file type
 *
 * @param fileId - The file ID
 * @param fileType - The file type (AIR or OCEAN)
 * @returns File detail including sheet summaries
 */
export async function getFileDetail(
  fileId: string,
  fileType: FileType,
): Promise<GetFileDetailResponse> {
  const basePath = getBasePath(fileType);
  return apiRequest<GetFileDetailResponse>(`${basePath}/files/${fileId}`);
}

/**
 * Update file metadata
 * Routes to appropriate endpoint based on file type
 * Note: This does NOT update sheets. Use separate sheet API for that.
 *
 * @param fileId - The file ID
 * @param fileType - The file type (AIR or OCEAN)
 * @param data - File metadata to update
 * @returns Success status
 */
export async function updateFile(
  fileId: string,
  fileType: FileType,
  data: UpdateFileRequest,
): Promise<UpdateFileResponse> {
  const basePath = getBasePath(fileType);
  return apiRequest<UpdateFileResponse>(`${basePath}/files/${fileId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a file and all its sheets
 * Routes to appropriate endpoint based on file type
 *
 * @param fileId - The file ID
 * @param fileType - The file type (AIR or OCEAN)
 * @returns Success status
 */
export async function deleteFile(
  fileId: string,
  fileType: FileType,
): Promise<DeleteFileResponse> {
  const basePath = getBasePath(fileType);
  return apiRequest<DeleteFileResponse>(`${basePath}/files/${fileId}`, {
    method: "DELETE",
  });
}

/**
 * Get dashboard statistics for files
 * Routes to appropriate endpoint based on file type
 *
 * @param fileType - The file type (AIR or OCEAN)
 * @returns Dashboard statistics
 */
export async function getFileDashboardStats(
  fileType: FileType,
): Promise<GetFileDashboardStatsResponse> {
  const basePath = getBasePath(fileType);
  return apiRequest<GetFileDashboardStatsResponse>(
    `${basePath}/dashboard/stats`,
  );
}
