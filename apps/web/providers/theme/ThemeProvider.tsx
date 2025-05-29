"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { Roboto } from "next/font/google";
import { type PropsWithChildren, useState } from "react";

import { theme } from "./theme";

const roboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-roboto", // Use variable font for consistency
  weight: ["300", "400", "500", "700"],
});

// Create Emotion cache for MUI styles
const createEmotionCache = () => createCache({ key: "css", prepend: true });

/**
 * Provider component that applies the theme and font globally.
 * Wraps the app in the MUI theme and font for consistent styling.
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  const [emotionCache] = useState(createEmotionCache);

  return (
    <CacheProvider value={emotionCache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {/* Reset default styles */}
        <div className={roboto.variable}>{children}</div> {/* Apply Roboto font */}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
