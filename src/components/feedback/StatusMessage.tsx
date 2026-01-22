import React from "react";

export type JobStatusType =
  | "LOADING"
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

const STATUS_CONFIG: Record<JobStatusType, { icon: string; message: string }> =
  {
    LOADING: { icon: "🧠", message: "AI is analyzing your Excel…" },
    PENDING: { icon: "⏳", message: "Job queued" },
    RUNNING: {
      icon: "⚙️",
      message: "Processing (LLM is thinking and structuring your Excel data)",
    },
    COMPLETED: { icon: "✅", message: "Processing Complete" },
    FAILED: { icon: "❌", message: "Failed" },
  };

export interface StatusMessageProps {
  status: JobStatusType;
  variant?: "default" | "muted";
}

/**
 * Reusable job status message
 * Accepts job status enum and renders appropriate icon/message
 */
export const StatusMessage: React.FC<StatusMessageProps> = ({
  status,
  variant = "default",
}) => {
  const config = STATUS_CONFIG[status];
  return (
    <p
      className={`text-sm ${variant === "muted" ? "text-gray-500" : "text-gray-600"}`}
    >
      {config.icon} {config.message}
    </p>
  );
};
