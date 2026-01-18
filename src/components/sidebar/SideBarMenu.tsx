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
        className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-700 font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span>{label}</span>
      </div>
    </Link>
  );
}
