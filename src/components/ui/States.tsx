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
 * Empty state placeholder for when no data is available
 * Used in tables, lists, and content areas
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => (
  <div className={`text-center py-12 px-4 ${className}`}>
    {icon && (
      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-xl text-gray-400">{icon}</span>
      </div>
    )}
    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * Loading state with spinner
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  className = "",
}) => {
  const t = useTranslations();
  const displayMessage = message ?? t("common.loading");

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <div className="relative">
        <div className="w-10 h-10 border-4 border-gray-200 rounded-full" />
        <div className="absolute top-0 left-0 w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-sm text-gray-500">{displayMessage}</p>
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
 * Skeleton loading placeholder
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
    rectangular: "rounded-md",
  };

  return (
    <div
      className={`bg-gray-200 animate-pulse ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};
