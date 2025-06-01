"use client";

import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

export const fonts = Roboto({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-roboto", // Use variable font for consistency
  weight: ["300", "400", "500", "700"],
});

export const theme = createTheme({
  cssVariables: true,

  palette: {
    mode: "dark",

    // Enhanced backgrounds with subtle gradients
    background: {
      default: "#0A0B0E", // Deep navy-black
      paper: "#141721", // Elevated surfaces
    },

    // Primary: Rich purple gradient (premium/focus)
    primary: {
      main: "#8B5CF6", // Rich violet
      light: "#A78BFA", // Light violet
      dark: "#7C3AED", // Deep violet
      contrastText: "#fff",
    },

    // Secondary: Warm amber/gold (luxury/action)
    secondary: {
      main: "#F59E0B", // Rich amber
      light: "#FCD34D", // Light amber
      dark: "#D97706", // Deep amber
      contrastText: "#000",
    },

    // Error: Soft red (not too aggressive)
    error: {
      main: "#FF5252",
      light: "#FF7A7A",
      dark: "#E04848",
    },

    // Warning: Golden yellow (caution/attention)
    warning: {
      main: "#FFD93D",
      light: "#FFE066",
      dark: "#E6C235",
      contrastText: "#000",
    },

    // Info: Cool blue (data/information)
    info: {
      main: "#4FC3F7",
      light: "#7DD3FC",
      dark: "#29B6F6",
      contrastText: "#000",
    },

    // Success: Balanced green (achievements) - toned down
    success: {
      main: "#10B981", // Emerald green - less intense
      light: "#34D399",
      dark: "#059669",
      contrastText: "#fff",
    },

    // Text with better hierarchy
    text: {
      primary: "#F8FAFC", // Almost white
      secondary: "#94A3B8", // Muted blue-gray
      disabled: "#64748B", // Darker muted
    },

    // Dividers and borders
    divider: "#1E293B", // Subtle blue-gray

    // Custom colors for fitness app
    grey: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "-0.02em",
    },

    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      letterSpacing: "-0.01em",
    },

    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "-0.01em",
    },

    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },

    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },

    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },

    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },

    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },

    button: {
      fontWeight: 600,
      textTransform: "none", // More modern
      letterSpacing: "0.01em",
    },
  },

  shape: {
    borderRadius: 12, // More rounded, modern feel
  },

  components: {
    // Enhanced button styles with purple gradients
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          boxShadow: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #FF6B6B 0%, #E55555 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #FF8E8E 0%, #FF6B6B 100%)",
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            background: "rgba(139, 92, 246, 0.08)",
          },
        },
        outlinedSecondary: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            background: "rgba(255, 107, 107, 0.08)",
          },
        },
      },
    },

    // Enhanced card styles
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #141721 0%, #1A1F2E 100%)",
          border: "1px solid #1E293B",
          borderRadius: 16,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s ease",
          },
        },
      },
    },

    // Enhanced paper/drawer styles
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #1E293B",
        },
      },
    },

    // Enhanced table styles
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(139, 92, 246, 0.06)",
          },
        },
      },
    },

    // Enhanced input styles
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8B5CF6",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8B5CF6",
              borderWidth: 2,
            },
          },
        },
      },
    },

    // Enhanced app bar
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #0A0B0E 0%, #141721 100%)",
          borderBottom: "1px solid #1E293B",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },
});
