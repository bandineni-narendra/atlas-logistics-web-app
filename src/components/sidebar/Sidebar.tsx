"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SideBarMenu } from "@/components/sidebar/SideBarMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUI } from "@/contexts/UIContext";
import Link from "next/link";
import Switch from "@mui/material/Switch";

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
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        ),
      },
      {
        label: t("navigation.createAirSheet"),
        href: "/air-freight-sheet",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        ),
      },
      {
        label: t("navigation.createOceanSheet"),
        href: "/ocean-freight-sheet",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
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
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
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
                  <svg
                    className={`w-4 h-4 text-[var(--on-surface-variant)] transition-transform duration-100 ${showDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
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
                  <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
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
                          <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                          </svg>
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
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
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
              <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
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
