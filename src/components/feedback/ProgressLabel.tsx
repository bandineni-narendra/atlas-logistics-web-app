import React from "react";

export interface ProgressLabelProps {
  completed: number;
  total: number;
  label?: string;
}

/**
 * Displays progress as "Processed X of Y"
 */
export const ProgressLabel: React.FC<ProgressLabelProps> = ({
  completed,
  total,
  label = "Processed",
}) => (
  <p className="text-sm text-gray-600">
    {label} {completed} of {total} sheets
  </p>
);
