"use client";

import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const shadowStyles = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
};

/**
 * Card container component
 * Base layout primitive for dashboard sections
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  shadow = "sm",
}) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl ${paddingStyles[padding]} ${shadowStyles[shadow]} ${className}`}
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
    className={`flex items-center justify-between pb-4 border-b border-gray-100 mb-4 ${className}`}
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
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
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
}) => <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>;

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
  <div className={`pt-4 mt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);
