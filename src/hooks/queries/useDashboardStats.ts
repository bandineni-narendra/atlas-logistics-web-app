import { useQuery } from "@tanstack/react-query";
import { filesService } from "@/services/filesService";
import { DashboardStats } from "@/types/api/sheets";

export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const [airResponse, oceanResponse] = await Promise.all([
                filesService.getFiles({ type: "AIR", page: 1, pageSize: 1 }),
                filesService.getFiles({ type: "OCEAN", page: 1, pageSize: 1 }),
            ]);

            return {
                totalSheets: (airResponse.total || 0) + (oceanResponse.total || 0),
                airSheets: airResponse.total || 0,
                oceanSheets: oceanResponse.total || 0,
                totalRows: 0,
                lastModified: new Date().toISOString(),
            };
        },
        staleTime: 60 * 1000, // 1 minute stale time for stats
    });
}
