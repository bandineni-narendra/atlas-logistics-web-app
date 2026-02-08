"use client";

import { WarningList } from "@/components/ui";

export type OceanWarningsProps = {
  warnings: string[];
};

/**
 * Displays warnings from AI processing
 * Only renders if warnings exist
 */
export function OceanWarnings({ warnings }: OceanWarningsProps) {
  return <WarningList warnings={warnings} title="Processing Warnings" />;
}
