"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SideBarMenu } from "@/components/sidebar/SideBarMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUI } from "@/contexts/UIContext";
import Link from "next/link";
import Switch from "@mui/material/Switch";
import { Home, Plane, Ship, Menu, ChevronDown, User, Moon, Sun, LogOut } from "lucide-react";

export type SidebarProps = {
  currentPath: string;
};

/**
 * Gmail-style sidebar navigation
 * Clean, flat design with SVG icons and pill active states
 */
export function Sidebar({ currentPath }: SidebarProps) {
  const t = useTranslations();
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleTheme, mounted } = useTheme();
  const { isSidebarCollapsed, toggleSidebar } = useUI();
  const [showDropdown, setShowDropdown] = useState(false);

  const menuItems = useMemo(
    () => [
      {
        label: t("navigation.home"),
        href: "/",
        icon: (
          <Home className="w-5 h-5" />
        ),
      },
      {
        label: t("navigation.createAirSheet"),
        href: "/air-freight-sheet",
        icon: (
          <Plane className="w-5 h-5" />
        ),
      },
      {
        label: t("navigation.createOceanSheet"),
        href: "/ocean-freight-sheet",
        icon: (
          <Ship className="w-5 h-5" />
        ),
      },
    ],
    [t],
  );

  return (
    <aside className={`${isSidebarCollapsed ? "w-20" : "w-64"} bg-surface border-r border-border flex flex-col h-screen transition-all duration-300 ease-in-out`}>
      {/* Header Section: Toggle & Logo */}
      <div className={`px-4 py-4 border-b border-border flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-surface text-textSecondary transition-colors duration-200"
          title={isSidebarCollapsed ? "Expand" : "Collapse"}
        >
          <Menu className="w-6 h-6" />
        </button>

        {!isSidebarCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden transition-opacity duration-300">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">A</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-medium text-textPrimary truncate">
                {t("common.appName")}
              </h1>
              <p className="text-xs text-textSecondary truncate">{t("common.appTagline")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 px-3 py-3 overflow-y-auto ${isSidebarCollapsed ? "flex flex-col items-center" : ""}`}>
        <div className={`space-y-1 w-full`}>
          {menuItems.map((item) => (
            <SideBarMenu
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
              isActive={currentPath === item.href}
              isCollapsed={isSidebarCollapsed}
            />
          ))}
        </div>
      </nav>

      {/* Footer — User Section */}
      <div className={`px-3 py-3 border-t border-border ${isSidebarCollapsed ? "flex justify-center" : ""}`}>
        {isAuthenticated && user ? (
          <div className="relative w-full">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full flex items-center rounded-full hover:bg-surface transition-colors duration-100 ${isSidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"}`}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {!isSidebarCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-textPrimary truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-textSecondary truncate">{user.email}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-textSecondary transition-transform duration-100 ${showDropdown ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className={`absolute bottom-full mb-1 bg-surface border border-border rounded-xl shadow-md overflow-hidden ${isSidebarCollapsed ? "left-14 w-48" : "left-0 right-0"}`}>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-textPrimary hover:bg-surface transition-colors duration-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-4 h-4 text-textSecondary" />
                  <span>{t("navigation.profile")}</span>
                </Link>
                {/* Theme Toggle */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-textPrimary hover:bg-surface transition-colors duration-100 cursor-pointer border-t border-border"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTheme();
                  }}
                >
                  {mounted ? (
                    <>
                      <div className="flex items-center gap-3">
                        {mode === "dark" ? (
                          <Moon className="w-4 h-4 text-textSecondary" />
                        ) : (
                          <Sun className="w-4 h-4 text-textSecondary" />
                        )}
                        <span>{mode === "dark" ? t("common.darkMode") : t("common.lightMode")}</span>
                      </div>
                      <Switch checked={mode === "dark"} size="small" color="default" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4" />
                        <span>{t("common.lightMode")}</span>
                      </div>
                      <div className="w-8 h-5" />
                    </>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error transition-colors duration-100 text-left border-t border-border"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("navigation.logout")}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className={`flex items-center rounded-full hover:bg-surface transition-colors duration-100 ${isSidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"}`}
            title={isSidebarCollapsed ? t("auth.login") : ""}
          >
            <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-textSecondary" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-textPrimary">
                  {t("auth.login")}
                </p>
              </div>
            )}
          </Link>
        )}
      </div>
    </aside>
  );
}
