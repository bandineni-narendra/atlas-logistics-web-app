"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import {
  LoadingState,
  LoginPrompt,
  DashboardStatsSection,
  SheetsSection,
} from "@/components/home";
import Head from "next/head";
import { useUI } from "@/contexts/UIContext";

export default function Home() {
  const t = useTranslations();
  const { isAuthenticated, isLoading } = useAuth();
  const { isSidebarCollapsed } = useUI();

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <main className={`transition-all duration-300 mx-auto flex flex-col w-full h-full ${isSidebarCollapsed ? "max-w-[98%] px-2 py-4" : "px-6 py-5 max-w-7xl"}`}>
      <header className="mb-5">
        <h1 className="text-xl font-medium text-[var(--on-surface)] tracking-tight">
          {t("home.title")}
        </h1>
        <p className="mt-0.5 text-sm text-[var(--on-surface-variant)]">
          {t("home.description")}
        </p>
      </header>

      {/* Dashboard Stats */}
      <DashboardStatsSection />

      {/* Your Sheets Section */}
      <SheetsSection />
    </main>
  );
}
