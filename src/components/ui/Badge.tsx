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
  default: "bg-surface text-textPrimary border-border",
  success: "bg-success text-white border-transparent",
  warning: "bg-warning text-white border-transparent",
  error: "bg-error text-white border-transparent",
  info: "bg-primary-soft text-primary border-transparent",
  neutral: "bg-surface text-textSecondary border-transparent",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-sm",
};

/**
 * Badge — M3 tonal pill
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
  loading: { variant: "info", dotColor: "bg-primary" },
  waiting: { variant: "neutral", dotColor: "bg-textSecondary" },
  pending: { variant: "warning", dotColor: "bg-warning" },
  running: { variant: "info", dotColor: "bg-primary" },
  completed: { variant: "success", dotColor: "bg-success" },
  failed: { variant: "error", dotColor: "bg-error" },
  success: { variant: "success", dotColor: "bg-success" },
  error: { variant: "error", dotColor: "bg-error" },
  warning: { variant: "warning", dotColor: "bg-warning" },
  info: { variant: "info", dotColor: "bg-primary" },
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
 * Status badge with animated dot — M3 style
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
        <span className="relative flex h-1.5 w-1.5">
          {shouldPulse && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${config.dotColor} opacity-75 animate-ping`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dotColor}`}
          />
        </span>
      )}
      {label}
    </Badge>
  );
};
