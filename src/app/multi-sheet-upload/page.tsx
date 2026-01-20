"use client";

import MultiSheetExcelUpload from "@/app/components/MultiSheetExcelUpload";

export default function MultiSheetUploadPage() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Multi-Sheet Excel Upload
        </h1>
        <p className="text-gray-600 mb-8">
          Upload an Excel file with multiple sheets for batch processing. Each sheet will be analyzed and structured separately.
        </p>

        <MultiSheetExcelUpload
          onUploadSuccess={(data) => {
            console.log("Upload successful:", data);
          }}
          onUploadError={(error) => {
            console.error("Upload error:", error);
          }}
        />
      </div>
    </div>
  );
}
