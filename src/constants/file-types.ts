/**
 * File Type Configuration
 * Centralized configuration for freight types
 */

export const FILE_TYPE_CONFIG = {
  ocean: {
    icon: "🚢",
    color: "bg-[var(--primary-container)]",
    textColor: "text-[var(--on-primary-container)]",
    label: "Ocean Freight",
  },
  air: {
    icon: "✈️",
    color: "bg-[var(--tertiary-container)]",
    textColor: "text-[var(--on-tertiary-container)]",
    label: "Air Freight",
  },
} as const;

export type FileTypeKey = keyof typeof FILE_TYPE_CONFIG;
