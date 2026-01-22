"use client";

import React from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

/**
 * Page header with title, description, and optional actions
 * Used at the top of dashboard pages
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumb,
  className = "",
}) => (
  <div className={`mb-6 ${className}`}>
    {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  </div>
);

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Section wrapper for grouping related content
 */
export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
}) => <section className={`space-y-4 ${className}`}>{children}</section>;

export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Section header for sub-sections within a page
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
  className = "",
}) => (
  <div className={`flex items-center justify-between ${className}`}>
    <div>
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      {description && (
        <p className="mt-0.5 text-sm text-gray-500">{description}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const maxWidthStyles = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

/**
 * Page container with consistent padding and max-width
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  maxWidth = "xl",
}) => (
  <div className={`px-6 py-6 ${maxWidthStyles[maxWidth]} ${className}`}>
    {children}
  </div>
);

export interface DividerProps {
  className?: string;
}

/**
 * Horizontal divider line
 */
export const Divider: React.FC<DividerProps> = ({ className = "" }) => (
  <hr className={`border-t border-gray-200 ${className}`} />
);
