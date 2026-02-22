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
    <aside className={`${isSidebarCollapsed ? "w-20" : "w-64"} bg-[var(--surface)] border-r border-[var(--outline-variant)] flex flex-col h-screen transition-all duration-300 ease-in-out`}>
      {/* Header Section: Toggle & Logo */}
      <div className={`px-4 py-4 border-b border-[var(--outline-variant)] flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] transition-colors duration-200"
          title={isSidebarCollapsed ? "Expand" : "Collapse"}
        >
          <Menu className="w-6 h-6" />
        </button>

        {!isSidebarCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden transition-opacity duration-300">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[var(--on-primary)] font-medium text-sm">A</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-medium text-[var(--on-surface)] truncate">
                {t("common.appName")}
              </h1>
              <p className="text-xs text-[var(--on-surface-variant)] truncate">{t("common.appTagline")}</p>
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
      <div className={`px-3 py-3 border-t border-[var(--outline-variant)] ${isSidebarCollapsed ? "flex justify-center" : ""}`}>
        {isAuthenticated && user ? (
          <div className="relative w-full">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full flex items-center rounded-full hover:bg-[var(--surface-container-low)] transition-colors duration-100 ${isSidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"}`}
            >
              <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--on-primary)] text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {!isSidebarCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-[var(--on-surface)] truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-[var(--on-surface-variant)] truncate">{user.email}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--on-surface-variant)] transition-transform duration-100 ${showDropdown ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className={`absolute bottom-full mb-1 bg-[var(--surface)] border border-[var(--outline-variant)] rounded-xl shadow-[var(--elevation-2)] overflow-hidden ${isSidebarCollapsed ? "left-14 w-48" : "left-0 right-0"}`}>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--on-surface)] hover:bg-[var(--surface-container-low)] transition-colors duration-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-4 h-4 text-[var(--on-surface-variant)]" />
                  <span>{t("navigation.profile")}</span>
                </Link>
                {/* Theme Toggle */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-[var(--on-surface)] hover:bg-[var(--surface-container-low)] transition-colors duration-100 cursor-pointer border-t border-[var(--outline-variant)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTheme();
                  }}
                >
                  {mounted ? (
                    <>
                      <div className="flex items-center gap-3">
                        {mode === "dark" ? (
                          <Moon className="w-4 h-4 text-[var(--on-surface-variant)]" />
                        ) : (
                          <Sun className="w-4 h-4 text-[var(--on-surface-variant)]" />
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
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--error-container)] transition-colors duration-100 text-left border-t border-[var(--outline-variant)]"
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
            className={`flex items-center rounded-full hover:bg-[var(--surface-container-low)] transition-colors duration-100 ${isSidebarCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"}`}
            title={isSidebarCollapsed ? t("auth.login") : ""}
          >
            <div className="w-8 h-8 bg-[var(--surface-container-high)] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-[var(--on-surface-variant)]" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--on-surface)]">
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
