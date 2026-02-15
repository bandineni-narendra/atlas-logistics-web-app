/**
 * API Layer Index
 *
 * Re-exports from the new service layer.
 * Legacy API client files are preserved but no longer actively imported.
 *
 * NEW ARCHITECTURE:
 * - services/apiClient.ts → unified HTTP client
 * - services/authService.ts → auth endpoints
 * - services/filesService.ts → file endpoints
 * - services/excelService.ts → excel processing endpoints
 */

// New unified services (preferred)
export { apiClient, ApiClientError } from "@/services/apiClient";
export { authService } from "@/services/authService";
export { filesService } from "@/services/filesService";
export { excelService } from "@/services/excelService";
