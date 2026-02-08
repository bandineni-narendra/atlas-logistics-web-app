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
  up: "text-emerald-600",
  down: "text-red-600",
  neutral: "text-gray-500",
};

const trendIcons = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

/**
 * Metric card for displaying KPIs and statistics
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  className = "",
}) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl p-5 ${className}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <p className={`mt-1 text-sm ${trendColors[trend.direction]}`}>
            {trendIcons[trend.direction]} {trend.value}
          </p>
        )}
      </div>
      {icon && (
        <div className="p-2 bg-blue-50 rounded-lg">
          <span className="text-blue-600">{icon}</span>
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
  md: "h-2",
  lg: "h-3",
};

const progressColors = {
  blue: "bg-blue-600",
  green: "bg-emerald-600",
  yellow: "bg-amber-500",
  red: "bg-red-600",
};

/**
 * Progress bar component
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
          <span className="text-gray-600">{value}</span>
          <span className="text-gray-400">{max}</span>
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${progressSizes[size]}`}
      >
        <div
          className={`${progressSizes[size]} ${progressColors[color]} transition-all duration-300`}
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
 * Confidence indicator with color coding
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
      ? "text-emerald-600"
      : percentage >= 60
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ProgressBar
        value={percentage}
        max={100}
        size={size}
        color={color}
        className="flex-1 max-w-32"
      />
      <span className={`text-sm font-semibold ${textColor}`}>
        {percentage}%
      </span>
    </div>
  );
};
