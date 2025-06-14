"use client";

import { ConfirmActionDialog } from "@/components";
import { useToast } from "@/providers";
import { Grid, Paper } from "@mui/material";
import { type PropsWithChildren, useState, useTransition } from "react";
import { deleteMeasurement } from "../actions";
import { measurementFormDefaultValues, useMeasurementForm } from "../hooks/useMeasurementForm";
import type { Measurement, MeasurementType, MeasurementTypeId } from "../schemas";
import { MeasurementChart } from "./MeasurementChart";
import { MeasurementFormDialog } from "./MeasurementFormDialog";
import { MeasurementList } from "./MeasurementList";
import { MeasurementListDialog } from "./MeasurementListDialog";

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

type MeasurementPageContentProps = {
  measurements: Measurement[];
  measurementTypes: MeasurementType[];
};

export function MeasurementPageContent({
  measurements,
  measurementTypes,
}: MeasurementPageContentProps) {
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
      } catch {
        toast.error("Failed to remove measurement.");
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
    <>
      <Grid container spacing={{ xs: 2, lg: 3 }}>
        <Grid size={{ xs: 12, lg: 12, xxl: 9 }}>
          <ElevatedPaper>
            <MeasurementChart
              measurements={measurements}
              onAddMeasurement={() => handleOpenMeasurementDialog("weight")}
            />
          </ElevatedPaper>
        </Grid>

        <Grid size={{ xs: 12, lg: 12, xxl: 3 }}>
          <ElevatedPaper>
            <MeasurementList
              measurements={measurements}
              onEdit={handleEditMeasurement}
              onDelete={handleOpenDeleteDialog}
              onViewAll={handleOpenAllMeasurementsDialog}
              onAddMeasurement={() => handleOpenMeasurementDialog()}
            />
          </ElevatedPaper>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <MeasurementFormDialog
        form={form}
        measurementTypes={measurementTypes}
        onClose={handleCloseMeasurementDialog}
        open={measurementDialogOpen}
      />

      <MeasurementListDialog
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
        onClose={handleCloseDeleteDialog}
        open={!!measurementToDelete}
        onConfirm={handleConfirmDelete}
        loading={isPending}
      />
    </>
  );
}
