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

export default function Home() {
  const t = useTranslations();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <main className="px-6 py-5 max-w-7xl mx-auto flex flex-col w-full h-full">
      <header className="mb-5">
        <h1 className="text-xl font-medium text-[var(--on-surface)] tracking-tight">
          {`Welcome to ${t("common.appName")}`}
        </h1>
        <p className="mt-0.5 text-sm text-[var(--on-surface-variant)]">
          Manage and organize your sheet data efficiently
        </p>
      </header>

      {/* Dashboard Stats */}
      <DashboardStatsSection />

      {/* Your Sheets Section */}
      <SheetsSection />
    </main>
  );
}
