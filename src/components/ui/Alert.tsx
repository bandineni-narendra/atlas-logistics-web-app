"use client";

import React from "react";
import { X as XIcon } from "lucide-react";

export interface AlertProps {
  variant: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  info: {
    container: "bg-primary-soft border-transparent",
    icon: "text-primary",
    title: "text-primary",
    content: "text-primary",
    defaultIcon: "ℹ",
  },
  success: {
    container: "bg-success border-transparent",
    icon: "text-success",
    title: "text-white",
    content: "text-white",
    defaultIcon: "✓",
  },
  warning: {
    container: "bg-warning border-transparent",
    icon: "text-warning",
    title: "text-white",
    content: "text-white",
    defaultIcon: "⚠",
  },
  error: {
    container: "bg-error border-transparent",
    icon: "text-error",
    title: "text-white",
    content: "text-white",
    defaultIcon: "✕",
  },
};

/**
 * Alert — M3 tonal surface
 */
export const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  children,
  icon,
  action,
  onDismiss,
  className = "",
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`flex gap-3 p-4 rounded-xl border ${styles.container} ${className}`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${styles.icon}`}>
        {icon ?? styles.defaultIcon}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
        )}
        <div className={`text-sm ${styles.content} ${title ? "mt-0.5" : ""}`}>
          {children}
        </div>
        {action && <div className="mt-3">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 text-textSecondary hover:text-textPrimary rounded-full p-1 hover:bg-surface"
          aria-label="Dismiss"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export interface WarningListProps {
  warnings: string[];
  title?: string;
  className?: string;
}

/**
 * Warning list — M3 style
 */
export const WarningList: React.FC<WarningListProps> = ({
  warnings,
  title,
  className = "",
}) => {
  if (warnings.length === 0) return null;

  return (
    <Alert variant="warning" title={title} className={className}>
      <ul className="list-disc list-inside space-y-1">
        {warnings.map((warning, index) => (
          <li key={index}>{warning}</li>
        ))}
      </ul>
    </Alert>
  );
};
