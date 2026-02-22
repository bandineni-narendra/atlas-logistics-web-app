/**
 * File Status Configuration
 * Centralized configuration for file statuses
 */

export const FILE_STATUS_CONFIG = {
  draft: {
    label: "Draft",
    color: "bg-[var(--warning-container)] text-[var(--on-warning-container)]"
  },
  saved: {
    label: "Saved",
    color: "bg-[var(--success-container)] text-[var(--on-success-container)]"
  },
  archived: {
    label: "Archived",
    color: "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]"
  },
} as const;

export type FileStatusKey = keyof typeof FILE_STATUS_CONFIG;
