"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, ConfidenceIndicator } from "@/components/ui";

export type OceanHeaderProps = {
  confidence: number;
  fileName?: string;
};

/**
 * Ocean freight results header
 * Displays confidence score in a metric card
 */
export function OceanHeader({ confidence, fileName }: OceanHeaderProps) {
  const t = useTranslations();

  return (
    <Card padding="md">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              {t("ocean.confidence")}
            </h3>
            <div className="mt-2">
              <ConfidenceIndicator value={confidence} size="md" />
            </div>
          </div>
          {fileName && (
            <div className="text-right">
              <p className="text-sm text-gray-500">{t("common.file")}</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {fileName}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
