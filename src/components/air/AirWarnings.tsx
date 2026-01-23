"use client";

import { WarningList } from "@/components/ui";

export type AirWarningsProps = {
  warnings: string[];
};

/**
 * Displays warnings from AI processing
 * Only renders if warnings exist
 */
export function AirWarnings({ warnings }: AirWarningsProps) {
  return <WarningList warnings={warnings} title="Processing Warnings" />;
}
