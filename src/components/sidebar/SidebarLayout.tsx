"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { usePathname } from "next/navigation";
import { useUI } from "@/contexts/UIContext";
import { useAuth } from "@/contexts/AuthContext";

export type SidebarLayoutProps = {
  children: React.ReactNode;
};

/**
 * Two-panel layout — M3 surface system
 */
export function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUI();
  const { isLoading: isAuthLoading } = useAuth();

  // Don't show sidebar on auth pages
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

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
