"use client";

import Link from "next/link";

export type SideBarMenuProps = {
  label: string;
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
};

/**
 * Sidebar menu item — M3 pill shape with tonal active state
 */
export function SideBarMenu({
  label,
  href,
  isActive = false,
  icon,
}: SideBarMenuProps) {
  return (
    <Link href={href}>
      <div
        className={`
          flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium
          transition-all duration-100 ease-out
          ${isActive
            ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
            : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]"
          }
        `}
      >
        {icon && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span>{label}</span>
      </div>
    </Link>
  );
}
