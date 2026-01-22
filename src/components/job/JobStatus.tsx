import React from "react";

export type JobStatusType =
  | "LOADING"
  | "WAITING"
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

const STATUS_CONFIG: Record<JobStatusType, { icon: string; label: string }> = {
  LOADING: { icon: "🧠", label: "AI is analyzing your Excel…" },
  WAITING: { icon: "⏸", label: "Waiting" },
  PENDING: { icon: "⏳", label: "Queued" },
  RUNNING: { icon: "⚙️", label: "Processing" },
  COMPLETED: { icon: "✅", label: "Completed" },
  FAILED: { icon: "❌", label: "Failed" },
};

export interface JobStatusProps {
  status?: JobStatusType | string | null;
  variant?: "inline" | "block";
}

/**
 * Reusable job status component
 * Renders icon + label based on status
 * Returns null if status is not provided or not recognized
 */
export const JobStatus: React.FC<JobStatusProps> = ({
  status,
  variant = "inline",
}) => {
  if (!status || !(status in STATUS_CONFIG)) {
    return null;
  }

  const config = STATUS_CONFIG[status as JobStatusType];

  if (variant === "block") {
    return (
      <p className="text-sm text-gray-600">
        {config.icon} {config.label}
      </p>
    );
  }

  return (
    <span>
      {config.icon} {config.label}
    </span>
  );
};
