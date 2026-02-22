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
  up: "text-success",
  down: "text-error",
  neutral: "text-textSecondary",
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
    className={`bg-surface border border-border rounded-xl p-4 ${className}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-textSecondary">{label}</p>
        <p className="mt-1 text-2xl font-medium text-textPrimary">{value}</p>
        {trend && (
          <p className={`mt-1 text-sm ${trendColors[trend.direction]}`}>
            {trendIcons[trend.direction]} {trend.value}
          </p>
        )}
      </div>
      {icon && (
        <div className="p-2 bg-primary-soft rounded-lg">
          <span className="text-primary">{icon}</span>
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
  blue: "bg-primary",
  green: "bg-success",
  yellow: "bg-warning",
  red: "bg-error",
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
          <span className="text-textSecondary">{value}</span>
          <span className="text-textSecondary opacity-60">{max}</span>
        </div>
      )}
      <div
        className={`w-full bg-surface rounded-full overflow-hidden ${progressSizes[size]}`}
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
      ? "text-success"
      : percentage >= 60
        ? "text-warning"
        : "text-error";

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
