"use client";

import React from "react";
import { Check } from "@mui/icons-material";

export interface FilterChipProps {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    onClear?: (e: React.MouseEvent) => void;
    icon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    className?: string;
}

/**
 * Filter Chip - M3 Style
 * Used for toggling filters or triggering filter menus
 */
export const FilterChip: React.FC<FilterChipProps> = ({
    label,
    isActive = false,
    onClick,
    onClear,
    icon,
    trailingIcon,
    className = "",
}) => {
    return (
        <button
            onClick={onClick}
            className={`
        relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        border select-none
        ${isActive
                    ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)] border-[var(--secondary-container)]"
                    : "bg-transparent text-[var(--on-surface-variant)] border-[var(--outline)] hover:bg-[var(--surface-container-high)]"
                }
        ${className}
      `}
        >
            {/* Leading Icon (Checkmark if active, or custom icon) */}
            {isActive && !icon && <Check sx={{ fontSize: 18 }} />}
            {icon && !isActive && <span className="text-[var(--primary)]">{icon}</span>}

            <span>{label}</span>

            {/* Trailing Icon (Dropdown arrow or Close 'X') */}
            {trailingIcon && (
                <span className={`ml-1 ${isActive ? "text-[var(--on-secondary-container)]" : "text-[var(--on-surface-variant)]"}`}>
                    {trailingIcon}
                </span>
            )}
        </button>
    );
};
