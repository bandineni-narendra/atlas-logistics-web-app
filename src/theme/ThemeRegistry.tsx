"use client";

import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    return (
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            {children}
        </AppRouterCacheProvider>
    );
}
