"use client";

import React from "react";



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



export interface DividerProps {
  className?: string;
}

/**
 * Horizontal divider — M3 outline-variant color
 */
export const Divider: React.FC<DividerProps> = ({ className = "" }) => (
  <hr className={`border-t border-[var(--outline-variant)] ${className}`} />
);
