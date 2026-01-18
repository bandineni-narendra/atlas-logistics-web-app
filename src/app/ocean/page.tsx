"use client";

import { useState } from "react";
import { OceanHeader } from "@/components/ocean/OceanHeader";
import { OceanWarnings } from "@/components/ocean/OceanWarnings";
import { OceanTable } from "@/components/ocean/OceanTable";
import { OceanFreightResult } from "@/types/ocean";
import ExcelUpload from "@/app/components/ExcelUpload";

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Ocean Freight Rates
        </h1>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
          <h2 className="text-sm font-semibold text-red-900">Error</h2>
          <p className="text-sm text-red-800 mt-1">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setResult(null);
            }}
            className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 underline"
          >
            Try Again
          </button>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Ocean Freight Rates
        </h1>
        <p className="text-gray-600 mb-6">
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
        <button
          onClick={() => {
            setResult(null);
            setError(null);
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Upload Different File
        </button>
      </div>
    </>
  );
}
