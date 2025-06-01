import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { PropsWithChildren } from "react";
import { theme } from "./theme";

/**
 * Provider component that applies the theme and font globally.
 * Wraps the app in the MUI theme and font for consistent styling.
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <AppRouterCacheProvider>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
