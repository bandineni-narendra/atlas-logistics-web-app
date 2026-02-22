import React from "react";
import { FileText } from "lucide-react";

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
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${variant === "muted"
      ? "bg-surface text-textSecondary border border-border"
      : "bg-primary-soft text-primary"
      }`}
  >
    <FileText className="w-4 h-4 flex-shrink-0" />
    <span className="text-sm font-medium truncate max-w-xs">{fileName}</span>
  </div>
);
