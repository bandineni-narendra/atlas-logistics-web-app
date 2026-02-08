"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { usePathname } from "next/navigation";

export type SidebarLayoutProps = {
  children: React.ReactNode;
};

/**
 * Two-panel layout wrapper
 * Combines sidebar + content area
 */
export function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  
  // Don't show sidebar on auth pages
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar currentPath={pathname} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
        {children}
      </main>
    </div>
  );
}
