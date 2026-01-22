import React from "react";

export interface ErrorTextProps {
  message: string;
}

/**
 * Inline error text (small, red)
 */
export const ErrorText: React.FC<ErrorTextProps> = ({ message }) => (
  <p className="text-sm text-red-600">{message}</p>
);
