"use client";

import { memo, useMemo } from "react";
import { Card, CardContent } from "@/components/ui";
import { DashboardStats } from "@/types/api/sheets";
import { DASHBOARD_LABELS, STAT_CARD_COLORS, StatCardColor } from "@/constants";

export interface StatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  color?: StatCardColor;
}

/**
 * Single Statistics Card Component
 * Memoized to prevent unnecessary re-renders
 */
const StatCard = memo<StatCardProps>(function StatCard({
  label,
  value,
  sublabel,
  color = "default",
}) {
  const colorClass = useMemo(() => {
    switch (color) {
      case "blue":
        return STAT_CARD_COLORS.BLUE;
      case "emerald":
        return STAT_CARD_COLORS.EMERALD;
      default:
        return STAT_CARD_COLORS.DEFAULT;
    }
  }, [color]);

  return (
    <Card padding="md">
      <CardContent>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`mt-1 text-3xl font-semibold ${colorClass}`}>
          {value}
        </p>
        <p className="mt-1 text-xs text-gray-400">{sublabel}</p>
      </CardContent>
    </Card>
  );
});

export interface DashboardStatsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

/**
 * Dashboard Stats Section Component
 * Displays overview metrics in a responsive grid
 * Memoized to prevent unnecessary re-renders when parent re-renders
 */
export const DashboardStatsSection = memo<DashboardStatsProps>(
  function DashboardStatsSection({ stats, loading }) {
    // Memoize the value formatter
    const formatValue = useMemo(
      () => (stat: number | undefined) => (loading ? DASHBOARD_LABELS.LOADING_PLACEHOLDER : stat || 0),
      [loading]
    );

    return (
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {DASHBOARD_LABELS.OVERVIEW_TITLE}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label={DASHBOARD_LABELS.TOTAL_SHEETS}
            value={formatValue(stats?.totalSheets)}
            sublabel={DASHBOARD_LABELS.TOTAL_SHEETS_SUBLABEL}
          />
          <StatCard
            label={DASHBOARD_LABELS.OCEAN_SHEETS}
            value={formatValue(stats?.oceanSheets)}
            sublabel={DASHBOARD_LABELS.OCEAN_SHEETS_SUBLABEL}
            color="blue"
          />
          <StatCard
            label={DASHBOARD_LABELS.AIR_SHEETS}
            value={formatValue(stats?.airSheets)}
            sublabel={DASHBOARD_LABELS.AIR_SHEETS_SUBLABEL}
            color="emerald"
          />
          <StatCard
            label={DASHBOARD_LABELS.TOTAL_ROWS}
            value={formatValue(stats?.totalRows)}
            sublabel={DASHBOARD_LABELS.TOTAL_ROWS_SUBLABEL}
          />
        </div>
      </div>
    );
  }
);
