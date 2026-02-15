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
    container: "bg-[var(--secondary-container)] border-transparent",
    icon: "text-[var(--primary)]",
    title: "text-[var(--on-primary-container)]",
    content: "text-[var(--on-secondary-container)]",
    defaultIcon: "ℹ",
  },
  success: {
    container: "bg-[var(--success-container)] border-transparent",
    icon: "text-[var(--success)]",
    title: "text-[var(--on-success-container)]",
    content: "text-[var(--on-success-container)]",
    defaultIcon: "✓",
  },
  warning: {
    container: "bg-[var(--warning-container)] border-transparent",
    icon: "text-[var(--warning)]",
    title: "text-[var(--on-warning-container)]",
    content: "text-[var(--on-warning-container)]",
    defaultIcon: "⚠",
  },
  error: {
    container: "bg-[var(--error-container)] border-transparent",
    icon: "text-[var(--error)]",
    title: "text-[var(--on-error-container)]",
    content: "text-[var(--on-error-container)]",
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
          className="flex-shrink-0 text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] rounded-full p-1 hover:bg-[var(--surface-container)]"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
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
