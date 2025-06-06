import {
  Button,
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
import { Controller, type UseFormReturn } from "react-hook-form";
import { createMeasurement } from "../actions/createMeasurement";
import { updateMeasurement } from "../actions/updateMeasurement";
import type { MeasurementForm } from "../hooks/useMeasurementsForm";

type MeasurementDialogProps = {
  open: boolean;
  onClose: () => void;
  measurementTypes: MeasurementType[];
  form: UseFormReturn<MeasurementForm>;
};

export function MeasurementDialog({
  open,
  onClose,
  measurementTypes,
  form,
}: MeasurementDialogProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = form;

  const id = getValues("id");
  const isEditing = !!id;

  const handleFormSubmit = handleSubmit((data: MeasurementForm) => {
    startTransition(async () => {
      try {
        if (isEditing) {
          await updateMeasurement({ ...data, id });
          toast.success("Measurement updated successfully");
        } else {
          await createMeasurement(data);
          toast.success("Measurement added successfully");
        }
        onClose();
      } catch (error) {
        const action = isEditing ? "update" : "add";
        toast.error(`Failed to ${action} measurement: ${error}`);
      }
    });
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleFormSubmit}>
        <DialogTitle>{isEditing ? "Edit Measurement" : "Add Measurement"}</DialogTitle>

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
                  slotProps={{
                    htmlInput: {
                      step: 0.1,
                      min: 0,
                    },
                  }}
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
          <Button onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isPending}>
            {isPending
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
                ? "Update Measurement"
                : "Add Measurement"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
