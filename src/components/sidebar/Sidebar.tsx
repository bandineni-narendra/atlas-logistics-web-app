"use client";

import { SideBarMenu } from "@/components/sidebar/SideBarMenu";

export type SidebarProps = {
  currentPath: string;
};

/**
 * Main sidebar navigation
 * Renders all menu items
 * Uses SideBarMenu for each item
 */
export function Sidebar({ currentPath }: SidebarProps) {
  const menuItems = [
    {
      label: "Home",
      href: "/",
      icon: "🏠",
    },
    {
      label: "Ocean Freight",
      href: "/ocean",
      icon: "🌊",
    },
    {
      label: "Flow",
      href: "/excel-flow",
      icon: "📊",
    },
    // Future menu items:
    // { label: "Air Freight", href: "/air", icon: "✈️" },
    // { label: "Customs", href: "/customs", icon: "📋" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 h-screen overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Atlas</h1>
        <p className="text-xs text-gray-500 mt-1">Logistics Platform</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <SideBarMenu
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isActive={currentPath === item.href}
          />
        ))}
      </nav>
    </aside>
  );
}
