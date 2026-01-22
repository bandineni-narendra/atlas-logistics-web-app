"use client";

import { useState } from "react";
import { OceanFreightResult } from "@/types/ocean";
import { ExcelUpload } from "@/components/excel";
import {
  OceanHeader,
  OceanWarnings,
  OceanTable,
  ErrorBox,
  PageTitle,
  LinkButton,
} from "@/components";

/**
 * Ocean Freight page
 * Shows Excel upload and displays processed results
 */
export default function OceanPage() {
  const [result, setResult] = useState<OceanFreightResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = (data: OceanFreightResult) => {
    setResult(data);
    setError(null);
  };

  const handleUploadError = (errorMsg: string) => {
    setError(errorMsg);
    setResult(null);
  };

  if (error) {
    return (
      <div className="px-8 py-6">
        <PageTitle>Ocean Freight Rates</PageTitle>
        <div className="mb-6 mt-6">
          <ErrorBox
            message={error}
            onRetry={() => {
              setError(null);
              setResult(null);
            }}
          />
        </div>
        <ExcelUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="px-8 py-6">
        <PageTitle>Ocean Freight Rates</PageTitle>
        <p className="text-gray-600 mb-6 mt-6">
          Upload an Excel file to extract and analyze Ocean Freight rate data.
        </p>
        <ExcelUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </div>
    );
  }

  return (
    <>
      <OceanHeader confidence={result.confidence} />
      <OceanWarnings warnings={result.warnings} />
      <OceanTable data={result.data} isLoading={isLoading} />
      <div className="px-8 py-4 border-t border-gray-200">
        <LinkButton
          onClick={() => {
            setResult(null);
            setError(null);
          }}
        >
          ← Upload Different File
        </LinkButton>
      </div>
    </>
  );
}
