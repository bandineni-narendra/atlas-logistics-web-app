"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { usePathname } from "next/navigation";
import { useUI } from "@/contexts/UIContext";

export type SidebarLayoutProps = {
  children: React.ReactNode;
};

/**
 * Two-panel layout — M3 surface system
 */
export function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUI();

  // Don't show sidebar on auth pages
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-surface">
      <Sidebar currentPath={pathname} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-surface transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
