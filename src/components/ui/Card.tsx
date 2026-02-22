"use client";

import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

/**
 * Card container — M3 flat surface, no shadow by default
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
}) => (
  <div
    className={`bg-background border border-border rounded-xl ${paddingStyles[padding]} ${className}`}
  >
    {children}
  </div>
);

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

/**
 * Card header with optional action buttons
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
  actions,
}) => (
  <div
    className={`flex items-center justify-between pb-3 border-b border-border mb-3 ${className}`}
  >
    <div>{children}</div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card title typography
 */
export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = "",
}) => (
  <h3 className={`text-base font-medium text-textPrimary ${className}`}>
    {children}
  </h3>
);

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card description/subtitle
 */
export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = "",
}) => <p className={`text-sm text-textSecondary mt-1 ${className}`}>{children}</p>;

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card content area
 */
export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => <div className={className}>{children}</div>;

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card footer with border separator
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
}) => (
  <div className={`pt-3 mt-3 border-t border-border ${className}`}>
    {children}
  </div>
);
