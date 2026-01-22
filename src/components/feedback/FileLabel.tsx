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
  <p
    className={`text-sm ${variant === "muted" ? "text-gray-600" : "text-gray-700"}`}
  >
    <strong>File:</strong> {fileName}
  </p>
);
