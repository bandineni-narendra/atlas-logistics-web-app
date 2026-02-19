/**
 * File Status Configuration
 * Centralized configuration for file statuses
 */

export const FILE_STATUS_CONFIG = {
  draft: { 
    label: "Draft", 
    color: "bg-amber-100 text-amber-800" 
  },
  saved: { 
    label: "Saved", 
    color: "bg-emerald-100 text-emerald-800" 
  },
  archived: { 
    label: "Archived", 
    color: "bg-gray-100 text-gray-800" 
  },
} as const;

export type FileStatusKey = keyof typeof FILE_STATUS_CONFIG;
