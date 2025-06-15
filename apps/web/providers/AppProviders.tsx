import { DateProvider } from "./date/DateProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import { ToastProvider } from "./toast/ToastProvider";

/**
 * A wrapper component that provides all necessary providers to the app.
 * Includes ThemeProvider for styling and ToastProvider for notifications.
 *
 * @param children - React components to be wrapped with providers.
 */
export function AppProviders({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider>
      <DateProvider>
        <ToastProvider>{children}</ToastProvider>
      </DateProvider>
    </ThemeProvider>
  );
}
