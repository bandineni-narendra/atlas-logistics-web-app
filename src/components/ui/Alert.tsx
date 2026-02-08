"use client";

import React from "react";

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
    container: "bg-blue-50 border-blue-200",
    icon: "text-blue-600",
    title: "text-blue-800",
    content: "text-blue-700",
    defaultIcon: "ℹ️",
  },
  success: {
    container: "bg-emerald-50 border-emerald-200",
    icon: "text-emerald-600",
    title: "text-emerald-800",
    content: "text-emerald-700",
    defaultIcon: "✓",
  },
  warning: {
    container: "bg-amber-50 border-amber-200",
    icon: "text-amber-600",
    title: "text-amber-800",
    content: "text-amber-700",
    defaultIcon: "⚠",
  },
  error: {
    container: "bg-red-50 border-red-200",
    icon: "text-red-600",
    title: "text-red-800",
    content: "text-red-700",
    defaultIcon: "✕",
  },
};

/**
 * Alert component for messages, warnings, and notifications
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
      className={`flex gap-3 p-4 rounded-lg border ${styles.container} ${className}`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${styles.icon}`}>
        {icon ?? styles.defaultIcon}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
        )}
        <div className={`text-sm ${styles.content} ${title ? "mt-1" : ""}`}>
          {children}
        </div>
        {action && <div className="mt-3">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={`flex-shrink-0 ${styles.icon} hover:opacity-70`}
          aria-label="Dismiss"
        >
          ✕
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
 * Warning list for displaying multiple warnings
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
