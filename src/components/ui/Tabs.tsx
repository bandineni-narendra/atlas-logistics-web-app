"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  children: React.ReactNode;
  defaultTab: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

/**
 * Tabs container — M3 style
 */
export const Tabs: React.FC<TabsProps> = ({
  children,
  defaultTab,
  onChange,
  className = "",
}) => {
  const [activeTab, setActiveTabState] = useState(defaultTab);

  const setActiveTab = useCallback(
    (id: string) => {
      setActiveTabState(id);
      onChange?.(id);
    },
    [onChange],
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Tab list — M3 bottom border indicator
 */
export const TabList: React.FC<TabListProps> = ({
  children,
  className = "",
}) => (
  <div className={`flex border-b border-border ${className}`} role="tablist">
    {children}
  </div>
);

export interface TabProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * Individual tab — M3 active indicator (3px primary bottom border)
 */
export const Tab: React.FC<TabProps> = ({
  id,
  children,
  disabled = false,
  className = "",
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab must be used within Tabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === id;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(id)}
      className={`
        px-4 py-2.5 text-sm font-medium -mb-px border-b-[3px] transition-colors duration-100
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
        ${isActive
          ? "text-primary border-primary"
          : "text-textSecondary border-transparent hover:text-textPrimary hover:bg-surface"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Tab panel content area
 */
export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  children,
  className = "",
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabPanel must be used within Tabs");

  const { activeTab } = context;
  if (activeTab !== id) return null;

  return (
    <div role="tabpanel" className={`pt-4 ${className}`}>
      {children}
    </div>
  );
};
