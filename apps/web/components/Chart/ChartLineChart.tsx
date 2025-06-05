import { Box, type SxProps } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import type { LineChartProps } from "@mui/x-charts/LineChart";

type ChartLineChartProps = Omit<LineChartProps, "sx"> & {
  /**
   * Chart height
   * @default 300
   */
  height?: number;

  /**
   * Show legend
   * @default false
   */
  showLegend?: boolean;

  /**
   * Chart theme variant
   * @default "dark"
   */
  theme?: "dark" | "light";

  /**
   * Grid line style
   * @default "dashed"
   */
  gridStyle?: "solid" | "dashed" | "dotted";

  /**
   * Custom sx overrides
   */
  sx?: SxProps;
};

const getThemeStyles = (theme: "dark" | "light", gridStyle: string) => ({
  "& .MuiChartsAxis-root": {
    "& .MuiChartsAxis-tickLabel": {
      fill: theme === "dark" ? "#888" : "#666",
      fontSize: "11px",
    },
    "& .MuiChartsAxis-label": {
      fill: theme === "dark" ? "#888" : "#666",
      fontSize: "12px",
    },
    "& .MuiChartsAxis-line": {
      stroke: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    "& .MuiChartsAxis-tick": {
      stroke: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
  },
  "& .MuiChartsGrid-root": {
    "& .MuiChartsGrid-line": {
      stroke: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      strokeDasharray: gridStyle === "dashed" ? "3 3" : gridStyle === "dotted" ? "1 2" : "none",
    },
  },
});

export function ChartLineChart({
  height = 300,
  showLegend = false,
  theme = "dark",
  gridStyle = "dashed",
  sx = {},
  ...props
}: ChartLineChartProps) {
  const themeStyles = getThemeStyles(theme, gridStyle);

  return (
    <Box width="100%">
      <LineChart
        height={height}
        hideLegend={!showLegend}
        sx={{
          ...themeStyles,
          ...sx,
        }}
        {...props}
      />
    </Box>
  );
}
