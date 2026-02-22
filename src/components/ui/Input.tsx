/**
 * Input Component — M3 outlined text field
 */

"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const hasError = !!error;

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="block text-sm font-medium text-[var(--on-surface-variant)] mb-1">
          {label}
          {props.required && <span className="text-[var(--error)] ml-0.5">*</span>}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 text-sm text-[var(--on-surface)]
          bg-[var(--surface-container-lowest)] border rounded-lg
          transition-all duration-100 ease-out
          ${hasError
            ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]"
            : "border-[var(--outline)] focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          }
          focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-opacity-30
          disabled:bg-[var(--surface-container)] disabled:text-[var(--on-surface-variant)] disabled:cursor-not-allowed
          placeholder:text-[var(--on-surface-variant)] placeholder:opacity-60
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-[var(--error)] flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-xs text-[var(--on-surface-variant)]">{helperText}</p>
      )}
    </div>
  );
};
