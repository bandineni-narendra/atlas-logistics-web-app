"use client";

import React from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700 border-gray-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

/**
 * Badge component for status, labels, and tags
 * Supports multiple variants and sizes
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  icon,
  className = "",
}) => (
  <span
    className={`inline-flex items-center gap-1 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    {children}
  </span>
);

export type StatusType =
  | "loading"
  | "waiting"
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "success"
  | "error"
  | "warning"
  | "info";

const statusConfig: Record<
  StatusType,
  { variant: BadgeVariant; dotColor: string }
> = {
  loading: { variant: "info", dotColor: "bg-blue-500" },
  waiting: { variant: "neutral", dotColor: "bg-slate-400" },
  pending: { variant: "warning", dotColor: "bg-amber-500" },
  running: { variant: "info", dotColor: "bg-blue-500" },
  completed: { variant: "success", dotColor: "bg-emerald-500" },
  failed: { variant: "error", dotColor: "bg-red-500" },
  success: { variant: "success", dotColor: "bg-emerald-500" },
  error: { variant: "error", dotColor: "bg-red-500" },
  warning: { variant: "warning", dotColor: "bg-amber-500" },
  info: { variant: "info", dotColor: "bg-blue-500" },
};

export interface StatusBadgeProps {
  status: StatusType;
  label: string;
  size?: BadgeSize;
  showDot?: boolean;
  pulse?: boolean;
  className?: string;
}

/**
 * Status badge with animated dot indicator
 * Used for job statuses, process states, etc.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "sm",
  showDot = true,
  pulse = false,
  className = "",
}) => {
  const config = statusConfig[status];
  const shouldPulse =
    pulse ||
    status === "loading" ||
    status === "running" ||
    status === "pending";

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {showDot && (
        <span className="relative flex h-2 w-2">
          {shouldPulse && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${config.dotColor} opacity-75 animate-ping`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`}
          />
        </span>
      )}
      {label}
    </Badge>
  );
};
