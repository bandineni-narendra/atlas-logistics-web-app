"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const t = useTranslations();
  const { isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "ocean" | "air">("all");

  // Load dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.stats);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

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
