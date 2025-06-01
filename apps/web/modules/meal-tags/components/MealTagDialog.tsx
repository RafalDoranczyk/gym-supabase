import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  DialogContentText,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMealTagForm } from "../forms/useMealTagForm";
import type { MealTag } from "@repo/schemas";
import { ControlledTextField, ColorPicker } from "@/components";
import { startTransition } from "react";

import { updateMealTag } from "../actions/updateMealTag";
import { useToast } from "@/providers";
import { createMealTag } from "../actions/createMealTag";
import { handleFormErrors } from "@/utils";

type MealTagDialogProps = {
  open: boolean;
  onClose: () => void;
  tag: MealTag | null;
};

export function MealTagDialog({ open, onClose, tag }: MealTagDialogProps) {
  const { control, formState, handleSubmit, reset, watch, setValue, setError } =
    useMealTagForm(tag);

  const toast = useToast();
  const selectedColor = watch("color");

  const editingTag = Boolean(tag);

  const onSubmit = handleSubmit((payload) => {
    startTransition(async () => {
      try {
        if (tag) {
          await updateMealTag({
            ...payload,
            id: tag.id,
          });
          toast.success("Meal tag updated successfully");
        } else {
          await createMealTag(payload);
          toast.success("Meal tag created successfully");
        }
        handleClose();
      } catch (error) {
        handleFormErrors(error, setError, toast, {
          name: "This tag name already exists",
        });
      }
    });
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const isSubmitting = formState.isSubmitting;
  const submitButtonText = isSubmitting
    ? editingTag
      ? "Updating..."
      : "Creating..."
    : editingTag
      ? "Update Tag"
      : "Create Tag";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: onSubmit,
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {editingTag ? "Edit Meal Tag" : "Create Meal Tag"}
        <IconButton onClick={handleClose} aria-label="close dialog" disabled={isSubmitting}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {editingTag
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
            disabled={isSubmitting}
            autoFocus={!editingTag}
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
            disabled={isSubmitting}
            placeholder="Optional description for this tag..."
          />

          <Box>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: isSubmitting ? "text.disabled" : "text.primary",
              }}
            >
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

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={isSubmitting} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ minWidth: 120 }}>
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
