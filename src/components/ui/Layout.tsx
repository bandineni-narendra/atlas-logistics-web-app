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
 * Page header — M3 typography, tighter spacing
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumb,
  className = "",
}) => (
  <div className={`mb-5 ${className}`}>
    {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-xl font-medium text-[var(--on-surface)] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-[var(--on-surface-variant)]">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
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
}) => <section className={`space-y-3 ${className}`}>{children}</section>;

export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Section header — M3 medium weight
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
  className = "",
}) => (
  <div className={`flex items-center justify-between ${className}`}>
    <div>
      <h2 className="text-base font-medium text-[var(--on-surface)]">{title}</h2>
      {description && (
        <p className="mt-0.5 text-sm text-[var(--on-surface-variant)]">{description}</p>
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
 * Page container — M3 consistent padding
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  maxWidth = "xl",
}) => (
  <div className={`px-6 py-5 ${maxWidthStyles[maxWidth]} ${className}`}>
    {children}
  </div>
);

export interface DividerProps {
  className?: string;
}

/**
 * Horizontal divider — M3 outline-variant color
 */
export const Divider: React.FC<DividerProps> = ({ className = "" }) => (
  <hr className={`border-t border-[var(--outline-variant)] ${className}`} />
);
