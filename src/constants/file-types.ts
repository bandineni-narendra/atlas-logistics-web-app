/**
 * File Type Configuration
 * Centralized configuration for freight types
 */

import { Ship, Plane } from "lucide-react";
import React from "react";

export const FILE_TYPE_CONFIG = {
  ocean: {
    icon: React.createElement(Ship, { className: "w-4 h-4" }),
    color: "bg-primary-soft",
    textColor: "text-primary",
    label: "Ocean Freight",
  },
  air: {
    icon: React.createElement(Plane, { className: "w-4 h-4" }),
    color: "bg-primary-soft",
    textColor: "text-primary",
    label: "Air Freight",
  },
} as const;

export type FileTypeKey = keyof typeof FILE_TYPE_CONFIG;
