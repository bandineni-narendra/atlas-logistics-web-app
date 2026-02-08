"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { OceanFreightResult } from "@/types/ocean";
import { ExcelUpload } from "@/components/excel";
import { OceanHeader, OceanWarnings, OceanTable } from "@/components/ocean";
import {
  PageContainer,
  PageHeader,
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
      <PageContainer>
        <PageHeader
          title={t("ocean.pageTitle")}
          description={t("ocean.uploadDescription")}
        />
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
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Select an Excel file to process</CardDescription>
            </CardHeader>
            <CardContent>
              <ExcelUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  // Empty state - no result yet
  if (!result) {
    return (
      <PageContainer>
        <PageHeader
          title={t("ocean.pageTitle")}
          description={t("ocean.uploadDescription")}
        />
        <Card>
          <CardHeader>
            <CardTitle>Upload Rate Sheet</CardTitle>
            <CardDescription>
              Upload an Excel file containing ocean freight rates for AI-powered
              extraction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExcelUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  // Result state - show data
  return (
    <PageContainer maxWidth="full">
      <PageHeader
        title={t("ocean.pageTitle")}
        actions={
          <Button variant="secondary" onClick={handleReset}>
            {t("buttons.uploadDifferentFile")}
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Confidence & Warnings Section */}
        <OceanHeader confidence={result.confidence} />
        <OceanWarnings warnings={result.warnings} />

        {/* Data Table */}
        <Card padding="none" shadow="md">
          <OceanTable data={result.data} isLoading={isLoading} />
        </Card>
      </div>
    </PageContainer>
  );
}
