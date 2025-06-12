import { ColorPicker, ControlledTextField } from "@/components";
import { useToast } from "@/providers";
import { handleFormErrors } from "@/utils";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTransition } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Close } from "@mui/icons-material";
import { createMealTag } from "../actions/createMealTag";
import { updateMealTag } from "../actions/updateMealTag";
import type { MealTagForm } from "../hooks/useMealTagForm";

type MealTagDialogProps = {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<MealTagForm>;
};

export function MealTagDialog({ open, onClose, form }: MealTagDialogProps) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const { control, formState, handleSubmit, watch, setValue, setError, getValues } = form;

  const selectedColor = watch("color");
  const isEditing = !!getValues("id");
  const isSubmitting = formState.isSubmitting;

  const onSubmit = handleSubmit((payload) => {
    startTransition(async () => {
      try {
        if (isEditing) {
          const id = getValues("id");
          await updateMealTag({ ...payload, id });
          toast.success("Meal tag updated successfully");
        } else {
          await createMealTag(payload);
          toast.success("Meal tag created successfully");
        }
        onClose();
      } catch (error) {
        handleFormErrors(error, setError, toast, {
          name: "This tag name already exists",
        });
      }
    });
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          component: "form",
          onSubmit: onSubmit,
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {isEditing ? "Edit Meal Tag" : "Create Meal Tag"}
        <IconButton onClick={onClose} aria-label="close dialog">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {isEditing
            ? "Update the details of this meal tag."
            : "Create a new meal tag to organize and categorize your meals."}
        </DialogContentText>

        <Stack spacing={3}>
          <ControlledTextField
            control={control}
            error={!!formState.errors.name}
            helperText={formState.errors.name?.message}
            label="Tag Name"
            name="name"
            required
            autoFocus={!isEditing}
            placeholder="e.g., Breakfast, Quick Meals, Vegetarian"
          />

          <ControlledTextField
            control={control}
            error={!!formState.errors.description}
            helperText={formState.errors.description?.message}
            label="Description"
            name="description"
            multiline
            rows={3}
            placeholder="Optional description for this tag..."
          />

          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Tag Color
            </Typography>
            <ColorPicker
              selectedColor={selectedColor || "#8B5CF6"}
              onChange={(color) => setValue("color", color)}
              error={!!formState.errors.color}
              helperText={formState.errors.color?.message}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" loading={isPending}>
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Tag"
              : "Create Tag"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
