import React from "react";

export interface FileLabelProps {
  fileName: string;
  variant?: "default" | "muted";
}

/**
 * Displays file name with label
 */
export const FileLabel: React.FC<FileLabelProps> = ({
  fileName,
  variant = "default",
}) => (
  <div
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${
      variant === "muted"
        ? "bg-gray-100 text-gray-600"
        : "bg-blue-50 text-blue-700"
    }`}
  >
    <svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <span className="text-sm font-medium truncate max-w-xs">{fileName}</span>
  </div>
);
