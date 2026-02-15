/**
 * File Status Configuration
 * Centralized configuration for file statuses — M3 tonal surfaces
 */

export const FILE_STATUS_CONFIG = {
  draft: {
    label: "Draft",
    color: "bg-[#fef7e0] text-[#b06000]",
  },
  saved: {
    label: "Saved",
    color: "bg-[#e6f4ea] text-[#137333]",
  },
  archived: {
    label: "Archived",
    color: "bg-[#f1f3f4] text-[#5f6368]",
  },
} as const;

export type FileStatusKey = keyof typeof FILE_STATUS_CONFIG;
