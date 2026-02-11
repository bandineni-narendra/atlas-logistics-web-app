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
import { getDashboardStats } from "@/api/sheets_client";
import { DashboardStats } from "@/types/api/sheets";
import { logger } from "@/utils";

export default function Home() {
  const t = useTranslations();
  const { isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "ocean" | "air">("all");

  // Memoize the stats loading function
  const loadStats = useCallback(async () => {
    try {
      logger.debug("[HomePage] Loading dashboard stats...");
      const response = await getDashboardStats();
      logger.debug("[HomePage] Dashboard stats loaded", response.stats);
      setStats(response.stats);
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
      <SheetsSection activeTab={activeTab} onTabChange={setActiveTab} />
    </PageContainer>
  );
}
