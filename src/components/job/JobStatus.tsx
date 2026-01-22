import React from "react";

export interface JobStatusProps {
  status: string;
}

export const JobStatus: React.FC<JobStatusProps> = ({ status }) => {
  switch (status) {
    case "WAITING":
      return <span>⏸ Waiting</span>;
    case "PENDING":
      return <span>⏳ Queued</span>;
    case "RUNNING":
      return <span>⚙️ Processing</span>;
    case "COMPLETED":
      return <span>✅ Completed</span>;
    case "FAILED":
      return <span>❌ Failed</span>;
    default:
      return <span>{status}</span>;
  }
};
