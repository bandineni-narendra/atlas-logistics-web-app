import React from "react";

export interface ErrorBoxProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * Reusable error message box
 * Displays error with optional retry action
 */
export const ErrorBox: React.FC<ErrorBoxProps> = ({
  title = "Error",
  message,
  onRetry,
  retryLabel = "Try Again",
}) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <h2 className="text-sm font-semibold text-red-900">{title}</h2>
    <p className="text-sm text-red-800 mt-1">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 underline"
      >
        {retryLabel}
      </button>
    )}
  </div>
);
