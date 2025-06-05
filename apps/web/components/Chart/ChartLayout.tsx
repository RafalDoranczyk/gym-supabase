import { Box } from "@mui/material";

// Minimum height to prevent layout shift between different chart states
const MINIMUM_TOTAL_HEIGHT = 600;

type ChartLayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout wrapper for consistent chart component structure.
 * Ensures all chart states (empty, no data, with data) have consistent height
 * and prevents layout shift when switching between states.
 */
export function ChartLayout({ children }: ChartLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: MINIMUM_TOTAL_HEIGHT,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </Box>
  );
}
