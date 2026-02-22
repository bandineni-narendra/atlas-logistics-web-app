"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  LoadingState,
  LoginPrompt,
  DashboardStatsSection,
  SheetsSection,
} from "@/components/home";
import { useUI } from "@/contexts/UIContext";
import { SearchBar } from "@/components/ui/SearchBar";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isSidebarCollapsed } = useUI();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <main className={`transition-all duration-300 mx-auto flex flex-col w-full h-full ${isSidebarCollapsed ? "max-w-[98%] px-2 py-4" : "px-6 py-5 max-w-7xl"}`}>
      {/* Top bar: Dashboard title left, Search right */}
      <div className="flex items-center justify-between pt-1 pb-4">
        <h1 className="text-xl font-semibold text-textPrimary tracking-tight">Dashboard</h1>
        <div className="w-72">
          <SearchBar />
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStatsSection />

      {/* Your Sheets Section */}
      <SheetsSection />
    </main>
  );
}
