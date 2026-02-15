"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SideBarMenu } from "@/components/sidebar/SideBarMenu";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

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
    <aside className="w-60 bg-[var(--surface)] border-r border-[var(--outline-variant)] flex flex-col h-screen">
      {/* Logo Section */}
      <div className="px-4 py-4 border-b border-[var(--outline-variant)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <span className="text-white font-medium text-sm">A</span>
          </div>
          <div>
            <h1 className="text-sm font-medium text-[var(--on-surface)]">
              {t("common.appName")}
            </h1>
            <p className="text-xs text-[var(--on-surface-variant)]">{t("common.appTagline")}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <div className="space-y-0.5">
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

      {/* Footer — User Section */}
      <div className="px-3 py-3 border-t border-[var(--outline-variant)]">
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-full hover:bg-[var(--surface-container-low)] transition-colors duration-100"
            >
              <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-[var(--on-surface)] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--on-surface-variant)] truncate">{user.email}</p>
              </div>
              <svg
                className={`w-4 h-4 text-[var(--on-surface-variant)] transition-transform duration-100 ${showDropdown ? "rotate-180" : ""
                  }`}
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
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-[var(--surface)] border border-[var(--outline-variant)] rounded-xl shadow-[var(--elevation-2)] overflow-hidden">
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
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--error-container)] transition-colors duration-100 text-left"
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
            className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-[var(--surface-container-low)] transition-colors duration-100"
          >
            <div className="w-8 h-8 bg-[var(--surface-container-high)] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-[var(--on-surface-variant)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--on-surface)]">
                {t("auth.login")}
              </p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
