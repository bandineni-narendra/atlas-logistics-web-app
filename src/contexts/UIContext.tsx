"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

interface UIContextType {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const contextValue = useMemo(
        () => ({
            isSidebarCollapsed,
            toggleSidebar: () => setIsSidebarCollapsed((prev) => !prev),
            setSidebarCollapsed: (collapsed: boolean) => setIsSidebarCollapsed(collapsed),
        }),
        [isSidebarCollapsed]
    );

    return (
        <UIContext.Provider value={contextValue}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}
