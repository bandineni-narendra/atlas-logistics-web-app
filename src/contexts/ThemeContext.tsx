"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "@/theme";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // 1. Check local storage
        const savedMode = localStorage.getItem("theme") as ThemeMode | null;

        if (savedMode) {
            setMode(savedMode);
            document.documentElement.setAttribute("data-theme", savedMode);
        } else {
            // 2. Check system preference
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initialMode = systemPrefersDark ? "dark" : "light";
            setMode(initialMode);
            document.documentElement.setAttribute("data-theme", initialMode);
        }
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("theme", newMode);
        document.documentElement.setAttribute("data-theme", newMode);
    };

    const theme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, mounted }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProviderWrapper");
    }
    return context;
}
