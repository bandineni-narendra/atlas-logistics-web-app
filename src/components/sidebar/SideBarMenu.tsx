"use client";

import Link from "next/link";

export type SideBarMenuProps = {
  label: string;
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
};

/**
 * Reusable sidebar menu item
 * Wraps navigation links with active state styling
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
          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
          transition-all duration-150 ease-in-out
          ${
            isActive
              ? "bg-blue-50 text-blue-700 shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }
        `}
      >
        {icon && (
          <span className={`text-base ${isActive ? "" : "opacity-70"}`}>
            {icon}
          </span>
        )}
        <span>{label}</span>
      </div>
    </Link>
  );
}
