/**
 * File Status Configuration
 * Centralized configuration for file statuses
 */

export const FILE_STATUS_CONFIG = {
  draft: {
    label: "Draft",
    color: "bg-warning text-white"
  },
  saved: {
    label: "Saved",
    color: "bg-success text-white"
  },
  archived: {
    label: "Archived",
    color: "bg-surface text-textSecondary"
  },
} as const;

export type FileStatusKey = keyof typeof FILE_STATUS_CONFIG;
