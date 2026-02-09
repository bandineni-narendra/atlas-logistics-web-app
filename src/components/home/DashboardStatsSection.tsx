"use client";

import { Card, CardContent } from "@/components/ui";
import { DashboardStats } from "@/types/api/sheets";

export interface StatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  color?: "default" | "blue" | "emerald";
}

/**
 * Single Statistics Card Component
 */
function StatCard({
  label,
  value,
  sublabel,
  color = "default",
}: StatCardProps) {
  const colorClasses = {
    default: "text-gray-900",
    blue: "text-blue-600",
    emerald: "text-emerald-600",
  };

  return (
    <Card padding="md">
      <CardContent>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`mt-1 text-3xl font-semibold ${colorClasses[color]}`}>
          {value}
        </p>
        <p className="mt-1 text-xs text-gray-400">{sublabel}</p>
      </CardContent>
    </Card>
  );
}

export interface DashboardStatsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

/**
 * Dashboard Stats Section Component
 * Displays overview metrics in a responsive grid
 */
export function DashboardStatsSection({ stats, loading }: DashboardStatsProps) {
  const value = (stat: number | undefined) => (loading ? "—" : stat || 0);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Sheets"
          value={value(stats?.totalSheets)}
          sublabel="All saved sheets"
        />
        <StatCard
          label="Ocean Sheets"
          value={value(stats?.oceanSheets)}
          sublabel="🚢 Freight rates"
          color="blue"
        />
        <StatCard
          label="Air Sheets"
          value={value(stats?.airSheets)}
          sublabel="✈️ Freight rates"
          color="emerald"
        />
        <StatCard
          label="Total Rows"
          value={value(stats?.totalRows)}
          sublabel="Data entries"
        />
      </div>
    </div>
  );
}
