/**
 * File Type Configuration
 * Centralized configuration for freight types
 */

export const FILE_TYPE_CONFIG = {
  ocean: {
    icon: "🚢",
    color: "bg-blue-50",
    textColor: "text-blue-700",
    label: "Ocean Freight",
  },
  air: {
    icon: "✈️",
    color: "bg-emerald-50",
    textColor: "text-emerald-700",
    label: "Air Freight",
  },
} as const;

export type FileTypeKey = keyof typeof FILE_TYPE_CONFIG;
