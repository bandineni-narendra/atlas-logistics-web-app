"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();

  const menuItems = useMemo(
    () => [
      {
        label: t("navigation.home"),
        href: "/",
        icon: "🏠",
      },
      {
        label: t("navigation.oceanFreight"),
        href: "/ocean",
        icon: "🚢",
      },
      {
        label: t("navigation.airFreight"),
        href: "/air",
        icon: "✈️",
      },
      {
        label: t("navigation.flow"),
        href: "/excel-flow",
        icon: "📊",
      },
      {
        label: t("navigation.createAirSheet"),
        href: "/air-freight-sheet",
        icon: "📋",
      },
      {
        label: t("navigation.createOceanSheet"),
        href: "/ocean-freight-sheet",
        icon: "📄",
      },
    ],
    [t],
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo Section */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {t("common.appName")}
            </h1>
            <p className="text-xs text-gray-500">{t("common.appTagline")}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <SideBarMenu
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
              isActive={currentPath === item.href}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@atlas.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
