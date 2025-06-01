import {
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
import { useIngredientGroupForm } from "../forms/useIngredientGroupForm";
import type { NutritionGroup } from "@repo/schemas";
import { ColorPicker, ControlledTextField } from "@/components";
import { startTransition } from "react";

import { updateIngredientGroup } from "../actions/updateIngredientGroup";
import { useToast } from "@/providers";
import { createIngredientGroup } from "../actions/createIngredientGroup";
import { handleFormErrors } from "@/utils";

type IngredientGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  group: NutritionGroup | null;
};

export function IngredientGroupDialog({ open, onClose, group }: IngredientGroupDialogProps) {
  const { control, formState, handleSubmit, reset, watch, setValue, setError } =
    useIngredientGroupForm(group);

  const toast = useToast();
  const selectedColor = watch("color");

  const editingGroup = Boolean(group);

  const onSubmit = handleSubmit((payload) => {
    startTransition(async () => {
      try {
        if (group) {
          await updateIngredientGroup({
            ...payload,
            id: group.id,
          });
          toast.success("Group updated successfully");
        } else {
          await createIngredientGroup(payload);
          toast.success("Group created successfully");
        }
        handleClose();
      } catch (error) {
        handleFormErrors(error, setError, toast, {
          name: "This name already exists",
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
    ? editingGroup
      ? "Updating..."
      : "Creating..."
    : editingGroup
      ? "Update Group"
      : "Create Group";

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
        {editingGroup ? "Edit Ingredient Group" : "Create Ingredient Group"}
        <IconButton onClick={handleClose} aria-label="close dialog" disabled={isSubmitting}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {editingGroup
            ? "Update the details of this ingredient group."
            : "Create a new ingredient group to organize your nutrition database."}
        </DialogContentText>

        <Stack spacing={3}>
          <ControlledTextField
            control={control}
            error={!!formState.errors.name}
            helperText={formState.errors.name?.message}
            label="Group Name"
            name="name"
            required
            disabled={isSubmitting}
            autoFocus={!editingGroup}
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
            placeholder="Optional description for this group..."
          />

          <ColorPicker
            selectedColor={selectedColor}
            onChange={(color) => setValue("color", color)}
            error={!!formState.errors.color}
            helperText={formState.errors.color?.message}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
