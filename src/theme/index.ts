"use client";

import { createTheme } from "@mui/material/styles";

// Light Theme
export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1a73e8", // var(--primary)
            light: "#d3e3fd", // var(--primary-container)
            dark: "#1765cc", // var(--primary-hover)
            contrastText: "#ffffff", // var(--on-primary)
        },
        background: {
            default: "#f8f9fa", // var(--surface-dim)
            paper: "#ffffff", // var(--surface)
        },
        text: {
            primary: "#202124", // var(--on-surface)
            secondary: "#5f6368", // var(--on-surface-variant)
        },
        error: {
            main: "#d93025",
            light: "#fce8e6",
            dark: "#a50e0e",
            contrastText: "#ffffff",
        },
        success: {
            main: "#1e8e3e",
            light: "#e6f4ea",
            dark: "#137333",
            contrastText: "#202124",
        },
        warning: {
            main: "#f9ab00",
            light: "#fef7e0",
            dark: "#b06000",
            contrastText: "#b06000",
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
                    // Force CSS variables for coloring to maintain dynamic theming capabilities
                    "&.MuiButton-containedPrimary": {
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-bg)",
                        "&:hover": {
                            backgroundColor: "var(--color-primary-hover)",
                        },
                    },
                    "&.MuiButton-outlinedPrimary": {
                        color: "var(--color-primary)",
                        borderColor: "var(--color-border)",
                        "&:hover": {
                            backgroundColor: "var(--color-surface)",
                            borderColor: "var(--color-primary)",
                        },
                    },
                    "&.MuiButton-textPrimary": {
                        color: "var(--color-primary)",
                        "&:hover": {
                            backgroundColor: "var(--color-surface)",
                        },
                    },
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    color: "var(--color-text-secondary)",
                    "&.Mui-checked": {
                        color: "var(--color-primary)",
                        "& + .MuiSwitch-track": {
                            backgroundColor: "var(--color-primary)",
                            opacity: 1,
                        },
                    },
                },
                track: {
                    backgroundColor: "var(--color-border)",
                    opacity: 1,
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
            main: "#8ab4f8", // var(--primary)
            light: "#174ea6", // var(--primary-container)
            dark: "#aecbfa", // var(--primary-hover)
            contrastText: "#041e49", // var(--on-primary)
        },
        background: {
            default: "#1f1f1f", // var(--surface-dim)
            paper: "#2d2e30", // var(--surface)
        },
        text: {
            primary: "#e8eaed", // var(--on-surface)
            secondary: "#9aa0a6", // var(--on-surface-variant)
        },
        error: {
            main: "#f28b82",
            light: "#8e1410",
            dark: "#fce8e6",
            contrastText: "#600200",
        },
        success: {
            main: "#81c995",
            light: "#0d652d",
            dark: "#aff5c6",
            contrastText: "#0d652d",
        },
        warning: {
            main: "#fdd663",
            light: "#e37400",
            dark: "#ffeac1",
            contrastText: "#ffeac1",
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
                    // Force CSS variables for coloring
                    "&.MuiButton-containedPrimary": {
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-bg)",
                        "&:hover": {
                            backgroundColor: "var(--color-primary-hover)",
                        },
                    },
                    "&.MuiButton-outlinedPrimary": {
                        color: "var(--color-primary)",
                        borderColor: "var(--color-border)",
                        "&:hover": {
                            backgroundColor: "var(--color-surface)",
                            borderColor: "var(--color-primary)",
                        },
                    },
                    "&.MuiButton-textPrimary": {
                        color: "var(--color-primary)",
                        "&:hover": {
                            backgroundColor: "var(--color-surface)",
                        },
                    },
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    color: "var(--color-text-secondary)",
                    "&.Mui-checked": {
                        color: "var(--color-primary)",
                        "& + .MuiSwitch-track": {
                            backgroundColor: "var(--color-primary)",
                            opacity: 1,
                        },
                    },
                },
                track: {
                    backgroundColor: "var(--color-border)",
                    opacity: 1,
                },
            },
        },
    },
});
