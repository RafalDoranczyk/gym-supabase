import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { MeasurementType } from "@repo/schemas";
import dayjs from "dayjs";

import { useToast } from "@/providers";

import { useTransition } from "react";
import { Controller } from "react-hook-form";
import { createMeasurement } from "../actions/createMeasurement";
import { type CreateMeasurementForm, useMeasurementForm } from "../hooks/useMeasurementsForm";

type MeasurementDrawerProps = {
  open: boolean;
  onClose: () => void;
  measurementTypes: MeasurementType[];
};

export function MeasurementDrawer({ open, onClose, measurementTypes }: MeasurementDrawerProps) {
  const toast = useToast();

  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = (data: CreateMeasurementForm) => {
    startTransition(() => {
      createMeasurement(data)
        .then(() => {
          toast.success("Measurement added successfully");
          onClose();
        })
        .catch((error) => {
          toast.error(`Failed to add measurement: ${error.message}`);
        });
    });
  };

  const {
    control,
    handleSubmit,
    resetForm,
    watch,
    formState: { errors },
  } = useMeasurementForm();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Add Measurement</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Measurement Type */}
            <Controller
              name="measurement_type_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Measurement Type"
                  fullWidth
                  required
                  error={!!errors.measurement_type_id}
                  helperText={errors.measurement_type_id?.message}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                >
                  {measurementTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* Value */}
            <Controller
              name="value"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  label="Value"
                  type="number"
                  value={value || ""}
                  onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
                  required
                  error={!!errors.value}
                  helperText={errors.value?.message}
                  inputProps={{ step: 0.1, min: 0 }}
                  fullWidth
                />
              )}
            />

            <Controller
              name="measured_at"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <DatePicker
                  {...field}
                  label="Date"
                  value={value ? dayjs(value) : null}
                  onChange={(newValue) => {
                    // Set time to noon (12:00) for consistency
                    const dateWithTime = newValue
                      ? newValue.hour(12).minute(0).second(0).millisecond(0)
                      : dayjs().hour(12).minute(0).second(0).millisecond(0);

                    onChange(dateWithTime.toISOString());
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.measured_at,
                      helperText: errors.measured_at?.message,
                    },
                  }}
                />
              )}
            />

            {/* Notes */}
            <Controller
              name="notes"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value || null)}
                  label="Notes (optional)"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Any additional notes about this measurement..."
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton onClick={handleClose} loading={isPending}>
            Cancel
          </LoadingButton>
          <LoadingButton type="submit" variant="contained" loading={isPending}>
            {isPending ? "Adding..." : "Add Measurement"}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
