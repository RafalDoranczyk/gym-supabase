"use client";

import { CountIndicator, SearchField } from "@/components";
import { Add, FilterList } from "@mui/icons-material";
import { Box, Button, Stack, Toolbar } from "@mui/material";
import type { MeasurementType } from "@repo/schemas";

type MeasurementsToolbarProps = {
  measurementTypes: MeasurementType[];
  measurementsCount: number;
  onAddMeasurement: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function MeasurementsToolbar({
  measurementTypes,
  measurementsCount,
  onAddMeasurement,
  searchValue = "",
  onSearchChange,
}: MeasurementsToolbarProps) {
  return (
    <Box
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        mb: 3,
        pb: 2,
      }}
    >
      <Toolbar sx={{ px: 0 }}>
        <Stack alignItems="center" direction="row" spacing={2}>
          {/* TODO: Filter by measurement type */}
          <CountIndicator end={measurementsCount} />
        </Stack>

        <Stack alignItems="center" direction="row" spacing={2} sx={{ ml: "auto" }}>
          <SearchField
            onChange={onSearchChange || (() => {})}
            value={searchValue}
            placeholder="Search measurements..."
          />
          <Button
            aria-label="Add new measurement"
            onClick={onAddMeasurement}
            variant="contained"
            size="medium"
            startIcon={<Add />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s",
            }}
          >
            Add Measurement
          </Button>
        </Stack>
      </Toolbar>
    </Box>
  );
}
