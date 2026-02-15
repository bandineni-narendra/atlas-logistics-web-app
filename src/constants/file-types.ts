/**
 * File Type Configuration
 * Centralized configuration for freight types — M3 tonal surfaces + SVG icons
 */

export const FILE_TYPE_CONFIG = {
  ocean: {
    icon: "🚢",
    color: "bg-[#e8f0fe]",
    textColor: "text-[#1a73e8]",
    label: "Ocean Freight",
  },
  air: {
    icon: "✈️",
    color: "bg-[#e6f4ea]",
    textColor: "text-[#137333]",
    label: "Air Freight",
  },
} as const;

export type FileTypeKey = keyof typeof FILE_TYPE_CONFIG;
