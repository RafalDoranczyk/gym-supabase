import { Add as AddIcon, TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import type { MeasurementWithType } from "@repo/schemas";
import { useState } from "react";

type MeasurementsChartsProps = {
  measurements: MeasurementWithType[];
  onAddMeasurement: () => void;
};

type TimeFilter = "1W" | "1M" | "3M" | "1Y";

function EmptyState({ onAddMeasurement }: { onAddMeasurement: () => void }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        color: "#666",
      }}
    >
      <TrendingUpIcon
        sx={{
          fontSize: 48,
          mb: 2,
          opacity: 0.5,
          color: "#888",
        }}
      />

      <Typography
        variant="h6"
        sx={{
          mb: 1,
          fontWeight: 600,
          color: "white",
        }}
      >
        Need More Data Points
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mb: 3,
          fontSize: "0.875rem",
        }}
      >
        Add at least 3 measurements to see your progress chart
      </Typography>

      <Button
        variant="contained"
        onClick={onAddMeasurement}
        startIcon={<AddIcon />}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 2,
          px: 3,
          py: 1,
          fontWeight: 500,
          textTransform: "none",
          fontSize: "0.875rem",
          "&:hover": {
            background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease",
        }}
      >
        Add First Measurements
      </Button>
    </Box>
  );
}

function TimeFilterButtons({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
}) {
  const filters: TimeFilter[] = ["1W", "1M", "3M", "1Y"];

  return (
    <ButtonGroup
      variant="outlined"
      size="small"
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

export function MeasurementsCharts({ measurements, onAddMeasurement }: MeasurementsChartsProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("1M");

  // Check if we have enough data points for a meaningful chart
  const hasEnoughData = measurements.length >= 3;

  return (
    <Box>
      {/* Chart Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
          }}
        >
          Progress Chart
        </Typography>

        {hasEnoughData && (
          <TimeFilterButtons activeFilter={timeFilter} onFilterChange={setTimeFilter} />
        )}
      </Box>

      {/* Chart Content */}
      {!hasEnoughData ? (
        <EmptyState onAddMeasurement={onAddMeasurement} />
      ) : (
        <Box
          sx={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed rgba(255, 255, 255, 0.2)",
            borderRadius: 2,
            color: "#888",
          }}
        >
          {/* TODO: Replace with actual chart component */}
          <Stack spacing={2} alignItems="center">
            <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.5 }} />
            <Typography variant="body2">Chart component will be rendered here</Typography>
            <Typography variant="caption" sx={{ color: "#666" }}>
              Showing {measurements.length} measurements for {timeFilter}
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Chart Legend/Info */}
      {hasEnoughData && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderRadius: 1,
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Typography variant="caption" sx={{ color: "#888" }}>
            💡 Tip: Click on legend items to toggle data series visibility
          </Typography>
        </Box>
      )}
    </Box>
  );
}
