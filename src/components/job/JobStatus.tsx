"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/ui";

export type JobStatusType =
  | "LOADING"
  | "WAITING"
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

const STATUS_VARIANT: Record<
  JobStatusType,
  "loading" | "pending" | "success" | "error"
> = {
  LOADING: "loading",
  WAITING: "pending",
  PENDING: "pending",
  RUNNING: "loading",
  COMPLETED: "success",
  FAILED: "error",
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
 * Renders StatusBadge based on status
 * Returns null if status is not provided or not recognized
 */
export const JobStatus: React.FC<JobStatusProps> = ({
  status,
  variant = "inline",
}) => {
  const t = useTranslations();

  if (!status || !(status in STATUS_VARIANT)) {
    return null;
  }

  const statusType = status as JobStatusType;
  const badgeVariant = STATUS_VARIANT[statusType];
  const label = t(STATUS_KEYS[statusType]);

  if (variant === "block") {
    return (
      <div className="py-1">
        <StatusBadge status={badgeVariant} label={label} />
      </div>
    );
  }

  return <StatusBadge status={badgeVariant} label={label} />;
};
