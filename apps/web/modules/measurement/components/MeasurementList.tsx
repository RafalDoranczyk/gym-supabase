"use client";

import { SearchFieldURL, TooltipIconButton } from "@/components";
import { formatDate } from "@/utils";
import { Add, Sort as SortIcon, Visibility as ViewIcon } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import type { Measurement } from "@repo/schemas";
import { useMemo, useState } from "react";

const MAX_MEASUREMENTS_TO_SHOW = 4;
const DISPLAY_UNIT = "kg";

type MeasurementListProps = {
  measurements: Measurement[];
  onEdit: (measurement: Measurement) => void;
  onDelete: (measurement: Measurement) => void;
  onViewAll: () => void;
  onAddMeasurement: () => void;
  isLoading?: boolean;
};

type MeasurementItemProps = {
  measurement: Measurement;
  onEdit: (measurement: Measurement) => void;
  onDelete: (measurement: Measurement) => void;
  isLast?: boolean;
  isLoading?: boolean;
};

// Helper function extracted and simplified
function getDisplayUnit(): string {
  return DISPLAY_UNIT;
}

function MeasurementItem({
  measurement,
  onEdit,
  onDelete,
  isLast,
  isLoading,
}: MeasurementItemProps) {
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
        {/* Measurement Info */}
        <Box flex={1}>
          <Typography variant="body1" fontWeight={500} mb={0.5} fontSize="0.95rem">
            {measurement.measurement_type.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
            {formatDate(new Date(measurement.measured_at))}
          </Typography>
        </Box>

        {/* Value & Actions */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography
            variant="body1"
            fontWeight={600}
            fontSize="1rem"
            textAlign="right"
            sx={{ minWidth: "60px" }}
          >
            {measurement.value} {getDisplayUnit()}
          </Typography>

          <TooltipIconButton
            size="small"
            onClick={() => onEdit(measurement)}
            variant="edit"
            disabled={isLoading}
          />
          <TooltipIconButton
            size="small"
            onClick={() => onDelete(measurement)}
            variant="delete"
            disabled={isLoading}
          />
        </Box>
      </Box>

      {!isLast && <Divider />}
    </>
  );
}

function EmptyMeasurementsState() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600} fontSize="1.125rem">
          Recent Measurements
        </Typography>
      </Box>

      <Box textAlign="center" py={6} color="text.disabled">
        <Typography variant="body1" mb={1}>
          No measurements yet
        </Typography>
        <Typography variant="body2" fontSize="0.875rem">
          Add your first measurement to get started
        </Typography>
      </Box>
    </Box>
  );
}

function SearchResults({
  resultCount,
  totalFiltered,
}: {
  resultCount: number;
  totalFiltered: number;
}) {
  return (
    <Box mt={2}>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Showing {resultCount} of {totalFiltered} results
        {totalFiltered > MAX_MEASUREMENTS_TO_SHOW && ` (first ${MAX_MEASUREMENTS_TO_SHOW})`}
      </Typography>
    </Box>
  );
}

function ViewAllButton({
  totalCount,
  onViewAll,
}: {
  totalCount: number;
  onViewAll: () => void;
}) {
  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={onViewAll}
      startIcon={<ViewIcon />}
      color="primary"
      sx={{
        mt: 2,
        textTransform: "none",
        fontWeight: 500,
      }}
    >
      View All Measurements ({totalCount})
    </Button>
  );
}

export function MeasurementList({
  measurements,
  onEdit,
  onDelete,
  onViewAll,
  onAddMeasurement,
  isLoading = false,
}: MeasurementListProps) {
  const [search, setSearch] = useState("");

  // Filter measurements based on search term
  const filteredMeasurements = useMemo(() => {
    if (!search.trim()) {
      return measurements;
    }

    const searchLower = search.toLowerCase().trim();
    return measurements.filter((measurement) => {
      // Search in measurement type name
      const typeNameMatch = measurement.measurement_type.name.toLowerCase().includes(searchLower);

      // Search in value
      const valueMatch = measurement.value.toString().includes(searchLower);

      // Search in formatted date
      const dateMatch = formatDate(new Date(measurement.measured_at))
        .toLowerCase()
        .includes(searchLower);

      // Search in notes if they exist
      const notesMatch = measurement.notes
        ? measurement.notes.toLowerCase().includes(searchLower)
        : false;

      return typeNameMatch || valueMatch || dateMatch || notesMatch;
    });
  }, [measurements, search]);

  // Sort filtered measurements by date (newest first) and take only the most recent
  const recentMeasurements = useMemo(() => {
    return [...filteredMeasurements]
      .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime())
      .slice(0, MAX_MEASUREMENTS_TO_SHOW);
  }, [filteredMeasurements]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  // Early return for empty state
  if (measurements.length === 0) {
    return <EmptyMeasurementsState />;
  }

  // Computed values
  const hasSearch = search.trim().length > 0;
  const hasResults = recentMeasurements.length > 0;
  const shouldShowViewAll = !hasSearch && measurements.length > MAX_MEASUREMENTS_TO_SHOW;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Typography variant="h5">Recent Measurements</Typography>
        <IconButton
          size="small"
          color="default"
          disabled={isLoading}
          sx={{
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <SortIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Controls */}
      <Stack spacing={2}>
        <SearchFieldURL
          value={search}
          onChange={handleSearchChange}
          placeholder="Search measurements..."
          disabled={isLoading}
        />

        <Button
          aria-label="Add new measurement"
          onClick={onAddMeasurement}
          variant="contained"
          size="medium"
          startIcon={<Add />}
          disabled={isLoading}
          loading={isLoading}
        >
          Add Measurement
        </Button>
      </Stack>

      {/* Measurements List */}
      <Box>
        {hasResults ? (
          recentMeasurements.map((measurement, index) => (
            <MeasurementItem
              key={measurement.id}
              measurement={measurement}
              onEdit={() => onEdit(measurement)}
              onDelete={() => onDelete(measurement)}
              isLast={index === recentMeasurements.length - 1}
              isLoading={isLoading}
            />
          ))
        ) : (
          <Box textAlign="center" py={4} color="text.disabled">
            <Typography variant="body2">No measurements found for "{search}"</Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      {hasSearch ? (
        <SearchResults
          resultCount={recentMeasurements.length}
          totalFiltered={filteredMeasurements.length}
        />
      ) : (
        shouldShowViewAll && (
          <ViewAllButton totalCount={measurements.length} onViewAll={onViewAll} />
        )
      )}
    </Box>
  );
}
