import { Button, ButtonGroup } from "@mui/material";

export type TimeFilterOption = "1W" | "1M" | "3M" | "6M" | "1Y" | "All";

export interface ChartTimeFilterProps<T extends string = TimeFilterOption> {
  /**
   * Currently active filter
   */
  activeFilter: T;

  /**
   * Callback when filter changes
   */
  onFilterChange: (filter: T) => void;

  /**
   * Available filter options
   * @default ["1W", "1M", "3M", "6M", "1Y", "All"];
   */
  filters?: readonly T[];

  /**
   * Button size
   * @default "small"
   */
  size?: "small" | "medium" | "large";

  /**
   * Button variant
   * @default "outlined"
   */
  variant?: "outlined" | "contained" | "text";
}

export const CHART_TIME_FILTERS: TimeFilterOption[] = ["1W", "1M", "3M", "6M", "1Y", "All"];

export function ChartTimeFilter<T extends string = TimeFilterOption>({
  activeFilter,
  onFilterChange,
  filters = CHART_TIME_FILTERS as unknown as readonly T[],
  size = "small",
  variant = "outlined",
}: ChartTimeFilterProps<T>) {
  return (
    <ButtonGroup
      variant={variant}
      size={size}
      sx={{
        "& .MuiButton-root": {
          borderColor: "rgba(255, 255, 255, 0.2)",
          color: "#888",
          minWidth: 40,
          px: 1.5,
          py: 0.5,
          fontSize: "0.75rem",
          textTransform: "none",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        },
        "& .MuiButton-root.active": {
          backgroundColor: "#667eea",
          borderColor: "#667eea",
          color: "white",
          "&:hover": {
            backgroundColor: "#5a6fd8",
            borderColor: "#5a6fd8",
          },
        },
      }}
    >
      {filters.map((filter) => (
        <Button
          key={filter}
          className={activeFilter === filter ? "active" : ""}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </Button>
      ))}
    </ButtonGroup>
  );
}
