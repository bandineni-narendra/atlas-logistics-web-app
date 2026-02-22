"use client";

import Link from "next/link";

export type SideBarMenuProps = {
  label: string;
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  isCollapsed?: boolean;
};

/**
 * Sidebar menu item — M3 pill shape with tonal active state
 */
export function SideBarMenu({
  label,
  href,
  isActive = false,
  icon,
  isCollapsed = false,
}: SideBarMenuProps) {
  return (
    <Link href={href}>
      <div
        className={`
          flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium
          transition-all duration-300 ease-in-out
          ${isActive
            ? "bg-primary-soft text-primary"
            : "text-textSecondary hover:bg-surface hover:text-textPrimary"
          }
          ${isCollapsed ? "justify-center px-2" : ""}
        `}
        title={isCollapsed ? label : ""}
      >
        {icon && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {!isCollapsed && (
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
        )}
      </div>
    </Link>
  );
}
