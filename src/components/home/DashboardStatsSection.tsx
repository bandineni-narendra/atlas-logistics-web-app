"use client";

import { DASHBOARD_LABELS, STAT_CARD_COLORS, StatCardColor } from "@/constants";
import { useDashboardStats } from "@/hooks/queries/useDashboardStats";

export interface StatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  color?: StatCardColor;
}

/**
 * Single stat metric — M3 flat inline style
 */
function StatCard({
  label,
  value,
  sublabel,
  color = "default",
}: StatCardProps) {
  let colorClass: string = STAT_CARD_COLORS.DEFAULT;
  if (color === "blue") colorClass = STAT_CARD_COLORS.BLUE;
  if (color === "emerald") colorClass = STAT_CARD_COLORS.EMERALD;

  return (
    <div className="flex-1 min-w-0 px-4 py-3">
      <p className="text-xs font-medium text-[var(--on-surface-variant)] uppercase tracking-wide">{label}</p>
      <p className={`mt-0.5 text-2xl font-medium ${colorClass}`}>
        {value}
      </p>
      <p className="mt-0.5 text-xs text-[var(--on-surface-variant)]">{sublabel}</p>
    </div>
  );
}

/**
 * Dashboard Stats — M3 flat horizontal metrics strip with dividers
 */
export function DashboardStatsSection() {
  const { data: stats, isLoading: loading } = useDashboardStats();

  const formatValue = (stat: number | undefined) => (loading ? DASHBOARD_LABELS.LOADING_PLACEHOLDER : stat || 0);

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
