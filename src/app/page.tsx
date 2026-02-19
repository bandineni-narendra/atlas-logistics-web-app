"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer, PageHeader } from "@/components/ui";
import {
  LoadingState,
  LoginPrompt,
  DashboardStatsSection,
  SheetsSection,
} from "@/components/home";
import { filesService } from "@/services/filesService";
import { logger } from "@/utils";

export default function Home() {
  const t = useTranslations();
  const { isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<{
    totalSheets: number;
    oceanSheets: number;
    airSheets: number;
    totalRows: number;
    lastModified: string;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Memoize the stats loading function
  const loadStats = useCallback(async () => {
    try {
      logger.debug("[HomePage] Loading dashboard stats...");

      // Fetch files for both types to compute stats
      const [airResponse, oceanResponse] = await Promise.all([
        filesService.getFiles({ type: "AIR", page: 1, pageSize: 1 }),
        filesService.getFiles({ type: "OCEAN", page: 1, pageSize: 1 }),
      ]);

      const dashboardStats = {
        totalSheets: (airResponse.total || 0) + (oceanResponse.total || 0),
        airSheets: airResponse.total || 0,
        oceanSheets: oceanResponse.total || 0,
        totalRows: 0,
        lastModified: new Date().toISOString(),
      };

      logger.debug("[HomePage] Dashboard stats loaded", dashboardStats);
      setStats(dashboardStats);
    } catch (error) {
      logger.error("[HomePage] Failed to load stats:", error);
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load dashboard stats when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      logger.debug("[HomePage] Not yet authenticated, skipping stats fetch");
      return;
    }

    loadStats();
  }, [isAuthenticated, loadStats]);

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome to ${t("common.appName")}`}
        description="Manage and organize your sheet data efficiently"
      />

      {/* Dashboard Stats */}
      <DashboardStatsSection stats={stats} loading={statsLoading} />

      {/* Your Sheets Section */}
      <SheetsSection />
    </PageContainer>
  );
}
