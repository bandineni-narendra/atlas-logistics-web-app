import React from "react";

export interface PageTitleProps {
  children: React.ReactNode;
}

/**
 * Page title component (h1)
 */
export const PageTitle: React.FC<PageTitleProps> = ({ children }) => (
  <h1 className="text-3xl font-bold text-textPrimary">{children}</h1>
);
