/**
 * React Query Excel Processing Hooks
 *
 * Query and mutation hooks for Excel sheet processing.
 * Includes automatic polling for job status.
 */

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { excelService } from "@/services/excelService";
import type {
    ProcessSheetRequest,
    MultiSheetRequest,
    JobStatusValue,
} from "@/types/api";

/**
 * Create a single-sheet processing job
 */
export function useCreateProcessingJob() {
    return useMutation({
        mutationFn: (data: ProcessSheetRequest) => excelService.createProcessingJob(data),
    });
}

/**
 * Poll job status until completion or failure
 */
export function useJobStatus(jobId: string) {
    return useQuery({
        queryKey: ["excel-job", jobId],
        queryFn: () => excelService.getJobStatus(jobId),
        enabled: !!jobId,
        refetchInterval: (query) => {
            const status = query.state.data?.status as JobStatusValue | undefined;
            // Poll every 2 seconds while pending/processing
            return status === "pending" || status === "processing" ? 2000 : false;
        },
    });
}

/**
 * Process multiple sheets with AI
 */
export function useProcessMultiSheet() {
    return useMutation({
        mutationFn: (data: MultiSheetRequest) => excelService.processMultiSheet(data),
    });
}

/**
 * Rule-based parsing (no AI)
 */
export function useParseRuleBased() {
    return useMutation({
        mutationFn: (data: MultiSheetRequest) => excelService.parseRuleBased(data),
    });
}

/**
 * Air freight multi-sheet parsing
 */
export function useParseAirFreight() {
    return useMutation({
        mutationFn: (data: MultiSheetRequest) => excelService.parseAirFreight(data),
    });
}
