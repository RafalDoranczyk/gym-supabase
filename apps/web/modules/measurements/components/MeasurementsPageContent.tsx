"use client";

import { ConfirmActionDialog } from "@/components";
import { useToast } from "@/providers";
import { Grid, Paper, Stack } from "@mui/material";
import type { Measurement, MeasurementType, MeasurementTypeId } from "@repo/schemas";
import { type PropsWithChildren, useState, useTransition } from "react";
import { deleteMeasurement } from "../actions/deleteMeasurement";
import { measurementFormDefaultValues, useMeasurementForm } from "../hooks/useMeasurementsForm";
import { AllMeasurementsDialog } from "./AllMeasurementsDialog";
import { CurrentWeightCard } from "./cards/CurrentWeightCard";
import { GoalProgressCard } from "./cards/GoalProgressCard";
import { LatestMeasurementsCard } from "./cards/LatestMeasurementsCard";
import { WeeklyStatsCard } from "./cards/WeeklyStatsCard";
import { MeasurementDialog } from "./MeasurementDialog";
import { MeasurementsChart } from "./MeasurementsChart";
import { MeasurementsList } from "./MeasurementsList";
import { MeasurementsToolbar } from "./MeasurementsToolbar";

function ElevatedPaper({ children }: PropsWithChildren) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "fit-content",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      {children}
    </Paper>
  );
}

type MeasurementsPageContentProps = {
  measurements: Measurement[];
  measurementsCount: number;
  measurementTypes: MeasurementType[];
};

export function MeasurementsPageContent({
  measurements,
  measurementsCount,
  measurementTypes,
}: MeasurementsPageContentProps) {
  const toast = useToast();

  // State for dialogs
  const [measurementToDelete, setMeasurementToDelete] = useState<Measurement | null>(null);
  const [measurementDialogOpen, setMeasurementDialogOpen] = useState(false);
  const [allMeasurementsDialogOpen, setAllMeasurementsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useMeasurementForm();

  // Measurement Dialog handlers
  const handleOpenMeasurementDialog = (measurement_type_id?: MeasurementTypeId) => {
    form.reset({ ...measurementFormDefaultValues, measurement_type_id });
    setMeasurementDialogOpen(true);
  };

  const handleCloseMeasurementDialog = () => {
    setMeasurementDialogOpen(false);
  };

  // All Measurements Dialog handlers
  const handleOpenAllMeasurementsDialog = () => {
    setAllMeasurementsDialogOpen(true);
  };

  const handleCloseAllMeasurementsDialog = () => {
    setAllMeasurementsDialogOpen(false);
  };

  // Delete handlers
  const handleOpenDeleteDialog = (measurement: Measurement) => {
    setMeasurementToDelete(measurement);
  };

  const handleCloseDeleteDialog = () => {
    setMeasurementToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!measurementToDelete?.id) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteMeasurement({ id: measurementToDelete.id });
        toast.success(
          `Measurement ${measurementToDelete.measurement_type.name.toLowerCase()} removed successfully`
        );
        handleCloseDeleteDialog();
      } catch (error) {
        toast.error(`Failed to remove measurement: ${(error as Error).message}`);
      }
    });
  };

  // Edit handler
  const handleEditMeasurement = (measurement: Measurement) => {
    form.reset(measurement);
    setMeasurementDialogOpen(true);
    // Close all measurements dialog if it was open
    setAllMeasurementsDialogOpen(false);
  };

  // Handler for delete from AllMeasurementsDialog
  const handleDeleteFromAllMeasurements = (measurementId: string) => {
    const measurement = measurements.find((m) => m.id === measurementId);
    if (measurement) {
      handleOpenDeleteDialog(measurement);
    }
  };

  return (
    <Stack spacing={4}>
      <MeasurementsToolbar
        measurementsCount={measurementsCount}
        onAddMeasurement={handleOpenMeasurementDialog}
      />

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CurrentWeightCard measurements={measurements} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <GoalProgressCard measurements={measurements} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <WeeklyStatsCard measurements={measurements} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <LatestMeasurementsCard measurements={measurements} />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, lg: 3 }}>
        <Grid size={{ xs: 12, lg: 12, xxl: 9 }}>
          <ElevatedPaper>
            <MeasurementsChart
              measurements={measurements}
              onAddMeasurement={() => handleOpenMeasurementDialog("weight")}
            />
          </ElevatedPaper>
        </Grid>

        <Grid size={{ xs: 12, lg: 12, xxl: 3 }}>
          <ElevatedPaper>
            <MeasurementsList
              measurements={measurements}
              onEdit={handleEditMeasurement}
              onDelete={handleOpenDeleteDialog}
              onViewAll={handleOpenAllMeasurementsDialog}
            />
          </ElevatedPaper>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <MeasurementDialog
        form={form}
        measurementTypes={measurementTypes}
        onClose={handleCloseMeasurementDialog}
        open={measurementDialogOpen}
      />

      <AllMeasurementsDialog
        open={allMeasurementsDialogOpen}
        onClose={handleCloseAllMeasurementsDialog}
        measurements={measurements}
        onEditMeasurement={handleEditMeasurement}
        onDeleteMeasurement={handleDeleteFromAllMeasurements}
      />

      <ConfirmActionDialog
        title="Delete Measurement"
        description={
          measurementToDelete
            ? `Are you sure you want to permanently delete this ${measurementToDelete.measurement_type.name.toLowerCase()} measurement? This action cannot be undone.`
            : "Are you sure you want to delete this measurement?"
        }
        handleClose={handleCloseDeleteDialog}
        open={!!measurementToDelete}
        onConfirm={handleConfirmDelete}
        loading={isPending}
      />
    </Stack>
  );
}
