"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    background: {
      default: "#121212",
      paper: "#1A1A1A",
    },
    divider: "#333",
    error: {
      main: "#EF5350",
    },
    mode: "dark",
    primary: {
      dark: "#009624",
      light: "#5EFc82",
      main: "#00C853", // intensywny success
    },
    secondary: {
      dark: "#F57C00",
      light: "#FFB74D",
      main: "#FF9800",
    },
    text: {
      primary: "#EAEAEA",
      secondary: "#A0A0A0",
    },
  },
});
