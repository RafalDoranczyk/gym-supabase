import type { TimeFilterOption } from "@/components";
import { FilterAlt, Timeline } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

const periodNames: Record<TimeFilterOption, string> = {
  "1W": "week",
  "1M": "month",
  "3M": "3 months",
  "6M": "6 months",
  "1Y": "year",
  All: "selected period",
};

type ChartNoDataStateProps = {
  timeFilter: TimeFilterOption;
  onFilterChange: (filter: TimeFilterOption) => void;
  onAddData: () => void;
  // Optional customization props - kept minimal
  dataType?: string;
  addButtonText?: string;
  icon?: ReactNode;
  showAllTimeButton?: boolean;
};

export function ChartNoDataState({
  timeFilter,
  onFilterChange,
  onAddData,
  dataType = "data",
  addButtonText = "Add Data",
  icon = <Timeline sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />,
  showAllTimeButton = true,
}: ChartNoDataStateProps) {
  const periodName = periodNames[timeFilter] || "selected period";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={4}
      textAlign="center"
    >
      {icon}

      <Typography variant="h6" fontWeight={600} mb={1} color="text.primary">
        No data for this {periodName}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3} maxWidth={400}>
        There are no {dataType} recorded during this time period. Try selecting a different time
        range or add some {dataType}.
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
        {showAllTimeButton && (
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            onClick={() => onFilterChange("All")}
            sx={{ textTransform: "none" }}
          >
            Show All Time
          </Button>
        )}

        <Button variant="contained" onClick={onAddData} sx={{ textTransform: "none" }}>
          {addButtonText}
        </Button>
      </Stack>
    </Box>
  );
}
