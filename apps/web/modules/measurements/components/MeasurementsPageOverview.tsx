"use client";

import { Add as AddIcon } from "@mui/icons-material";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import type { Measurement, MeasurementType } from "@repo/schemas";

import { useTransition } from "react";
import { createMeasurement } from "../actions/createMeasurement";
import type { CreateMeasurementForm } from "../hooks/useMeasurementsForm";
import { useMeasurementForm } from "../hooks/useMeasurementsForm";
import { useMeasurementsUI } from "../hooks/useMeasurementsUI";
import { MeasurementsCharts } from "./MeasurementCharts";
import { MeasurementDrawer } from "./MeasurementDrawer";
import { MeasurementsList } from "./MeasurementsList";
import { MeasurementsQuickStats } from "./MeasurementsQuickStats";

type MeasurementsPageOverviewProps = {
  measurements: Measurement[];
  measurementsCount: number;
  measurementTypes: MeasurementType[];
};

export function MeasurementsPageOverview({
  measurements,
  measurementsCount,
  measurementTypes,
}: MeasurementsPageOverviewProps) {
  const { drawer, openDrawer, closeDrawer } = useMeasurementsUI();

  const handleEditMeasurement = (measurement: Measurement) => {
    console.log("Edit:", measurement);
    // TODO: Open drawer in edit mode
  };

  const handleDeleteMeasurement = (measurement: Measurement) => {
    console.log("Delete:", measurement);
    // TODO: Show delete confirmation
  };

  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={3}
        sx={{ mb: 4 }}
      >
        <Box sx={{ flex: 1, maxWidth: "60%" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 1,
              fontSize: { xs: "1.75rem", md: "2.125rem" },
            }}
          >
            Measurements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your fitness progress with detailed measurements and charts.
          </Typography>
        </Box>

        <Button variant="contained" onClick={openDrawer} startIcon={<AddIcon />}>
          Add Measurement
        </Button>
      </Stack>

      {/* <MeasurementsQuickStats measurements={measurements} measurementTypes={measurementTypes} /> */}

      {/* <Grid container spacing={{ xs: 2, lg: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: "fit-content",
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <MeasurementsCharts measurements={measurements} onAddMeasurement={openDrawer} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: "fit-content",
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <MeasurementsList
              measurements={measurements}
              onEdit={handleEditMeasurement}
              onDelete={handleDeleteMeasurement}
              onViewAll={() => {
                console.log("View all measurements");
                // TODO: Navigate to full measurements page
              }}
            />
          </Paper>
        </Grid>
      </Grid> */}

      {/* Fixed: Use isPending from useTransition */}
      <MeasurementDrawer
        measurementTypes={measurementTypes}
        onClose={closeDrawer}
        open={drawer.isOpen}
      />
    </div>
  );
}
