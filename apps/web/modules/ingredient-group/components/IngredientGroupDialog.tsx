"use client";

import { ColorPicker, ControlledTextField } from "@/components";
import { useToast } from "@/providers";
import { handleFormErrors } from "@/utils";
import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { useTransition } from "react";
import type { UseFormReturn } from "react-hook-form";
import { createIngredientGroup, updateIngredientGroup } from "../actions";
import type { IngredientGroupFormData } from "../schemas";

type IngredientGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<IngredientGroupFormData>;
};

export function IngredientGroupDialog({ open, onClose, form }: IngredientGroupDialogProps) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const { control, formState, handleSubmit, watch, setValue, setError, getValues } = form;

  const selectedColor = watch("color");
  const isEditing = !!getValues("id");

  const onSubmit = handleSubmit((payload) => {
    startTransition(async () => {
      try {
        if (isEditing) {
          const id = getValues("id");

          if (!id) {
            throw new Error("Ingredient group ID is missing.");
          }

          await updateIngredientGroup({ ...payload, id });
          toast.success("Group updated successfully");
        } else {
          await createIngredientGroup(payload);
          toast.success("Group created successfully");
        }
        onClose();
      } catch (error) {
        handleFormErrors(error, setError, toast, {
          name: "This name already exists",
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
        {isEditing ? "Edit Ingredient Group" : "Create Ingredient Group"}
        <IconButton onClick={onClose} aria-label="close dialog">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {isEditing
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
            autoFocus={!isEditing}
          />

          <ControlledTextField
            control={control}
            error={!!formState.errors.description}
            helperText={formState.errors.description?.message}
            label="Description"
            name="description"
            multiline
            rows={3}
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
        <Button onClick={onClose} disabled={isPending} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" loading={isPending}>
          {isPending
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Group"
              : "Create Group"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
