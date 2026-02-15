"use client";

import { createTheme } from "@mui/material/styles";

// Light Theme
export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1a73e8", // Google Blue
            contrastText: "#ffffff",
        },
        background: {
            default: "#f8f9fa", // Surface Dim
            paper: "#ffffff", // Surface
        },
        text: {
            primary: "#202124", // On Surface
            secondary: "#5f6368", // On Surface Variant
        },
    },
    typography: {
        fontFamily: "var(--font-family)",
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: "9999px", // Pill shape
                },
            },
        },
    },
});

// Dark Theme
export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#8ab4f8", // Google Blue (Dark Mode)
            contrastText: "#041e49", // On Primary Container
        },
        background: {
            default: "#1f1f1f", // Surface Dim (Dark)
            paper: "#2d2e30", // Surface (Dark)
        },
        text: {
            primary: "#e8eaed", // On Surface (Dark)
            secondary: "#9aa0a6", // On Surface Variant (Dark)
        },
    },
    typography: {
        fontFamily: "var(--font-family)",
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: "9999px",
                },
            },
        },
    },
});
