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
  default: "bg-[var(--surface-container)] text-[var(--on-surface)] border-[var(--outline-variant)]",
  success: "bg-[var(--success-container)] text-[var(--on-success-container)] border-transparent",
  warning: "bg-[var(--warning-container)] text-[var(--on-warning-container)] border-transparent",
  error: "bg-[var(--error-container)] text-[var(--on-error-container)] border-transparent",
  info: "bg-[var(--secondary-container)] text-[var(--on-secondary-container)] border-transparent",
  neutral: "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] border-transparent",
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
  loading: { variant: "info", dotColor: "bg-[var(--primary)]" },
  waiting: { variant: "neutral", dotColor: "bg-[var(--on-surface-variant)]" },
  pending: { variant: "warning", dotColor: "bg-[var(--warning)]" },
  running: { variant: "info", dotColor: "bg-[var(--primary)]" },
  completed: { variant: "success", dotColor: "bg-[var(--success)]" },
  failed: { variant: "error", dotColor: "bg-[var(--error)]" },
  success: { variant: "success", dotColor: "bg-[var(--success)]" },
  error: { variant: "error", dotColor: "bg-[var(--error)]" },
  warning: { variant: "warning", dotColor: "bg-[var(--warning)]" },
  info: { variant: "info", dotColor: "bg-[var(--primary)]" },
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
