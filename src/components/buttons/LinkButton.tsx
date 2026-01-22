import React from "react";

export interface LinkButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "default";
}

/**
 * Text-styled button (looks like a link)
 */
export const LinkButton: React.FC<LinkButtonProps> = ({
  onClick,
  children,
  variant = "primary",
}) => (
  <button
    onClick={onClick}
    className={`text-sm font-medium ${
      variant === "primary"
        ? "text-blue-600 hover:text-blue-700"
        : "text-gray-600 hover:text-gray-700"
    }`}
  >
    {children}
  </button>
);
