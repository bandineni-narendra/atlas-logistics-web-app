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
    className={`text-sm font-medium ${variant === "primary"
        ? "text-primary hover:text-primary-hover"
        : "text-textSecondary hover:text-textPrimary"
      }`}
  >
    {children}
  </button>
);
