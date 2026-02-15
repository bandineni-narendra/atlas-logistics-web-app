"use client";

import { memo, useMemo } from "react";
import { DashboardStats } from "@/types/api/sheets";
import { DASHBOARD_LABELS, STAT_CARD_COLORS, StatCardColor } from "@/constants";

export interface StatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  color?: StatCardColor;
}

/**
 * Single stat metric — M3 flat inline style
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
    <div className="flex-1 min-w-0 px-4 py-3">
      <p className="text-xs font-medium text-[var(--on-surface-variant)] uppercase tracking-wide">{label}</p>
      <p className={`mt-0.5 text-2xl font-medium ${colorClass}`}>
        {value}
      </p>
      <p className="mt-0.5 text-xs text-[var(--on-surface-variant)]">{sublabel}</p>
    </div>
  );
});

export interface DashboardStatsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

/**
 * Dashboard Stats — M3 flat horizontal metrics strip with dividers
 */
export const DashboardStatsSection = memo<DashboardStatsProps>(
  function DashboardStatsSection({ stats, loading }) {
    const formatValue = useMemo(
      () => (stat: number | undefined) => (loading ? DASHBOARD_LABELS.LOADING_PLACEHOLDER : stat || 0),
      [loading]
    );

    return (
      <div className="mt-6">
        <h2 className="text-sm font-medium text-[var(--on-surface-variant)] mb-3 uppercase tracking-wide">
          {DASHBOARD_LABELS.OVERVIEW_TITLE}
        </h2>
        <div className="bg-[var(--surface)] border border-[var(--outline-variant)] rounded-xl flex divide-x divide-[var(--outline-variant)]">
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
