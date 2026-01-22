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

  return (
    <div className="flex h-screen bg-white">
      <Sidebar currentPath={pathname} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
        {children}
      </main>
    </div>
  );
}
