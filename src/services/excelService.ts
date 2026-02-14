/**
 * Excel Processing Service
 *
 * Typed service for all Excel/sheet processing API endpoints.
 * Handles single-sheet, multi-sheet, rule-based, and air-freight parsing.
 */

import { apiClient } from "./apiClient";
import type {
    ProcessSheetRequest,
    JobResponse,
    JobStatus,
    MultiSheetRequest,
} from "@/types/api";

export class ExcelService {
    /**
     * Create a single-sheet processing job (AI-powered)
     */
    async createProcessingJob(data: ProcessSheetRequest): Promise<JobResponse> {
        return apiClient.post<JobResponse>("/excel-flow/jobs", data);
    }

    /**
     * Get job status and result
     */
    async getJobStatus(jobId: string): Promise<JobStatus> {
        return apiClient.get<JobStatus>(`/excel-flow/jobs/${jobId}`);
    }

    /**
     * Process all sheets with AI and combine results
     */
    async processMultiSheet(data: MultiSheetRequest): Promise<JobResponse> {
        return apiClient.post<JobResponse>("/excel-flow/multi-sheet", data);
    }

    /**
     * Rule-based parsing (no AI required)
     */
    async parseRuleBased(data: MultiSheetRequest): Promise<unknown> {
        return apiClient.post("/excel-flow/rule-based", data);
    }

    /**
     * Parse air freight data (multiple sheets)
     */
    async parseAirFreight(data: MultiSheetRequest): Promise<JobResponse> {
        return apiClient.post<JobResponse>("/excel-flow/air-freight", data);
    }

    /**
     * Parse single air freight sheet
     */
    async parseAirFreightSingle(
        sheetName: string,
        rows: (string | number)[][],
    ): Promise<unknown> {
        return apiClient.post("/excel-flow/air-freight/single", {
            sheetName,
            rows,
        });
    }

    /**
     * Get rule-based parsing statistics
     */
    async getRuleBasedStats(data: MultiSheetRequest): Promise<unknown> {
        return apiClient.post("/excel-flow/rule-based/stats", data);
    }
}

export const excelService = new ExcelService();
