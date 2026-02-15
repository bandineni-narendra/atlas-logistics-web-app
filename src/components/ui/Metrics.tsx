"use client";

import React from "react";

export interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

const trendColors = {
  up: "text-[var(--success)]",
  down: "text-[var(--error)]",
  neutral: "text-[var(--on-surface-variant)]",
};

const trendIcons = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

/**
 * Metric card — M3 flat surface, no elevation
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  className = "",
}) => (
  <div
    className={`bg-[var(--surface)] border border-[var(--outline-variant)] rounded-xl p-4 ${className}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-[var(--on-surface-variant)]">{label}</p>
        <p className="mt-1 text-2xl font-medium text-[var(--on-surface)]">{value}</p>
        {trend && (
          <p className={`mt-1 text-sm ${trendColors[trend.direction]}`}>
            {trendIcons[trend.direction]} {trend.value}
          </p>
        )}
      </div>
      {icon && (
        <div className="p-2 bg-[var(--primary-container)] rounded-lg">
          <span className="text-[var(--primary)]">{icon}</span>
        </div>
      )}
    </div>
  </div>
);

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "yellow" | "red";
  showLabel?: boolean;
  className?: string;
}

const progressSizes = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

const progressColors = {
  blue: "bg-[var(--primary)]",
  green: "bg-[var(--success)]",
  yellow: "bg-[var(--warning)]",
  red: "bg-[var(--error)]",
};

/**
 * Progress bar — M3 style
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = "md",
  color = "blue",
  showLabel = false,
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[var(--on-surface-variant)]">{value}</span>
          <span className="text-[var(--on-surface-variant)] opacity-60">{max}</span>
        </div>
      )}
      <div
        className={`w-full bg-[var(--surface-container)] rounded-full overflow-hidden ${progressSizes[size]}`}
      >
        <div
          className={`${progressSizes[size]} ${progressColors[color]} transition-all duration-200 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export interface ConfidenceIndicatorProps {
  value: number;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Confidence indicator — M3 color coding
 */
export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  value,
  size = "md",
  className = "",
}) => {
  const percentage = Math.round(value * 100);
  const color =
    percentage >= 80 ? "green" : percentage >= 60 ? "yellow" : "red";
  const textColor =
    percentage >= 80
      ? "text-[var(--success)]"
      : percentage >= 60
        ? "text-[var(--warning)]"
        : "text-[var(--error)]";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ProgressBar
        value={percentage}
        max={100}
        size={size}
        color={color}
        className="flex-1 max-w-32"
      />
      <span className={`text-sm font-medium ${textColor}`}>
        {percentage}%
      </span>
    </div>
  );
};
