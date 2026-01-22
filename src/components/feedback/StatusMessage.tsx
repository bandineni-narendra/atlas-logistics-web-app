import React from "react";

export interface StatusMessageProps {
  icon?: string;
  message: string;
  variant?: "default" | "muted";
}

/**
 * Reusable status message (icon + text)
 */
export const StatusMessage: React.FC<StatusMessageProps> = ({
  icon,
  message,
  variant = "default",
}) => (
  <p
    className={`text-sm ${variant === "muted" ? "text-gray-500" : "text-gray-600"}`}
  >
    {icon && <>{icon} </>}
    {message}
  </p>
);
