import type { PropsWithChildren } from "react";

import { ThemeProvider } from "./theme/ThemeProvider";
import { ToastProvider } from "./toast/ToastProvider";

/**
 * A wrapper component that provides all necessary providers to the app.
 * It includes:
 * - ThemeProvider for app-wide theme management
 * - ToasterProvider for managing toast notifications
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      {/* ToasterProvider wraps the children to manage toast notifications */}
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
