"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { OceanFreightResult } from "@/types/ocean";
import { ExcelUpload } from "@/components/excel";
import { OceanHeader, OceanWarnings, OceanTable } from "@/components/ocean";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Alert,
  Button,
  EmptyState,
} from "@/components/ui";

/**
 * Ocean Freight page
 * Shows Excel upload and displays processed results
 */
export default function OceanPage() {
  const t = useTranslations();
  const [result, setResult] = useState<OceanFreightResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = useCallback((data: OceanFreightResult) => {
    setResult(data);
    setError(null);
  }, []);

  const handleUploadError = useCallback((errorMsg: string) => {
    setError(errorMsg);
    setResult(null);
  }, []);

  const handleReset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  // Error state
  if (error) {
    return (
      <main className="px-6 py-5 max-w-7xl mx-auto flex flex-col w-full h-full">
        <header className="mb-5">
          <h1 className="text-xl font-medium text-textPrimary tracking-tight">
            {t("ocean.pageTitle")}
          </h1>
          <p className="mt-0.5 text-sm text-textSecondary">{t("ocean.uploadDescription")}</p>
        </header>
        <div className="space-y-6">
          <Alert
            variant="error"
            title={t("errors.title")}
            action={
              <Button variant="ghost" size="sm" onClick={handleReset}>
                {t("buttons.tryAgain")}
              </Button>
            }
          >
            {error}
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle>{t("ocean.uploadFile")}</CardTitle>
              <CardDescription>{t("ocean.uploadFileDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ExcelUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Empty state - no result yet
  if (!result) {
    return (
      <main className="px-6 py-5 max-w-7xl mx-auto flex flex-col w-full h-full">
        <header className="mb-5">
          <h1 className="text-xl font-medium text-textPrimary tracking-tight">
            {t("ocean.pageTitle")}
          </h1>
          <p className="mt-0.5 text-sm text-textSecondary">{t("ocean.uploadDescription")}</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>{t("ocean.uploadRateSheet")}</CardTitle>
            <CardDescription>
              {t("ocean.uploadRateSheetDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExcelUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </CardContent>
        </Card>
      </main>
    );
  }

  // Result state - show data
  return (
    <main className="px-6 py-5 w-full h-full">
      <header className="mb-5 flex items-start justify-between">
        <h1 className="text-xl font-medium text-textPrimary tracking-tight">
          {t("ocean.pageTitle")}
        </h1>
        <Button variant="secondary" onClick={handleReset}>
          {t("buttons.uploadDifferentFile")}
        </Button>
      </header>

      <div className="space-y-6">
        {/* Confidence & Warnings Section */}
        <OceanHeader confidence={result.confidence} />
        <OceanWarnings warnings={result.warnings} />

        {/* Data Table */}
        <Card padding="none">
          <OceanTable data={result.data} isLoading={isLoading} />
        </Card>
      </div>
    </main>
  );
}
