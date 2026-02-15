"use client";

import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-hover)] border-transparent shadow-none",
  secondary:
    "bg-[var(--secondary-container)] text-[var(--on-secondary-container)] hover:brightness-95 border-transparent shadow-none",
  outline:
    "bg-transparent text-[var(--primary)] hover:bg-[var(--surface-container-low)] border-[var(--outline)] shadow-none",
  ghost:
    "bg-transparent text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] border-transparent shadow-none",
  danger:
    "bg-[var(--error)] text-[var(--on-error)] hover:brightness-90 border-transparent shadow-none",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-2.5 text-sm gap-2",
};

/**
 * Button — M3 style with pill shape and tonal variants
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-full border
        transition-all duration-100 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-1
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
}

/**
 * Icon-only button — M3 circular with accessible label
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = "ghost",
  size = "md",
  label,
  className = "",
  ...props
}) => {
  const sizeStylesIcon: Record<ButtonSize, string> = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`
        inline-flex items-center justify-center rounded-full border
        transition-all duration-100 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-1
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStylesIcon[size]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};
