"use client";

import React from "react";
import { useTranslations } from "next-intl";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Empty state — M3 minimal, muted colors
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => (
  <div className={`text-center py-10 px-4 ${className}`}>
    {icon && (
      <div className="mx-auto w-10 h-10 rounded-full bg-surface flex items-center justify-center mb-3">
        <span className="text-lg text-textSecondary">{icon}</span>
      </div>
    )}
    <h3 className="text-sm font-medium text-textPrimary">{title}</h3>
    {description && <p className="mt-1 text-sm text-textSecondary">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * Loading state — M3 circular progress
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  className = "",
}) => {
  const t = useTranslations();
  const displayMessage = message ?? t("common.loading");

  return (
    <div
      className={`flex flex-col items-center justify-center py-10 ${className}`}
    >
      <div className="relative">
        <div className="w-9 h-9 border-[3px] border-surface rounded-full" />
        <div className="absolute top-0 left-0 w-9 h-9 border-[3px] border-primary rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="mt-3 text-sm text-textSecondary">{displayMessage}</p>
    </div>
  );
};

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}

/**
 * Skeleton loading placeholder — M3 surface variant pulse
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
}) => {
  const variantStyles = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`bg-surface animate-pulse ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};
