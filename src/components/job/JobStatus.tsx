"use client";

import React from "react";
import { useTranslations } from "next-intl";

export type JobStatusType =
  | "LOADING"
  | "WAITING"
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

const STATUS_ICONS: Record<JobStatusType, string> = {
  LOADING: "🧠",
  WAITING: "⏸",
  PENDING: "⏳",
  RUNNING: "⚙️",
  COMPLETED: "✅",
  FAILED: "❌",
};

const STATUS_KEYS: Record<JobStatusType, string> = {
  LOADING: "status.loading",
  WAITING: "status.waiting",
  PENDING: "status.pending",
  RUNNING: "status.running",
  COMPLETED: "status.completed",
  FAILED: "status.failed",
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
  const t = useTranslations();

  if (!status || !(status in STATUS_ICONS)) {
    return null;
  }

  const icon = STATUS_ICONS[status as JobStatusType];
  const label = t(STATUS_KEYS[status as JobStatusType]);

  if (variant === "block") {
    return (
      <p className="text-sm text-gray-600">
        {icon} {label}
      </p>
    );
  }

  return (
    <span>
      {icon} {label}
    </span>
  );
};
