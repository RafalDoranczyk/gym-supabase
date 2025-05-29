"use client";

import { ControlledSelect, ControlledTextField, Drawer } from "@/components";
import { useToast } from "@/providers";
import { LoadingButton } from "@mui/lab";
import { Box, Stack } from "@mui/material";
import { INGREDIENT_UNIT_TYPES, type Ingredient, type NutritionGroup } from "@repo/schemas";
import { useTransition } from "react";

import { createIngredient } from "../actions/createIngredient";
import { updateIngredient } from "../actions/updateIngredient";
import { useIngredientForm } from "../forms/useIngredientForm";
import { handleCreateIngredientError } from "../forms/errorHandlers";
import { IngredientNumberFields } from "./IngredientNumberFields";

const unitTypeOptions = Object.entries(INGREDIENT_UNIT_TYPES).map(([id, name]) => ({
  id,
  name,
}));

type IngredientDrawerProps = {
  ingredient: Ingredient | null;
  ingredientGroups: NutritionGroup[];
  onClose: () => void;
  open: boolean;
};

export function IngredientDrawer({
  ingredient,
  ingredientGroups,
  onClose,
  open,
}: IngredientDrawerProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const { control, formState, handleSubmit, reset, setError, watch } = useIngredientForm(
    ingredient,
    ingredientGroups,
  );

  const unitType = watch("unit_type");

  const onSubmit = handleSubmit((payload) => {
    startTransition(() => {
      if (ingredient) {
        updateIngredient({
          ...payload,
          id: ingredient.id,
        })
          .then(() => {
            toast.success("Ingredient updated successfully");
            onClose();
          })
          .catch((error) => {
            handleCreateIngredientError(error, setError);
          });
      } else {
        createIngredient(payload)
          .then(() => {
            reset();
            toast.success("Ingredient saved successfully");
            onClose();
          })
          .catch((error) => {
            handleCreateIngredientError(error, setError);
          });
      }
    });
  });

  return (
    <Drawer.Root
      BackdropProps={{
        onClick: (event) => event.stopPropagation(),
      }}
      onClose={onClose}
      open={open}
      size="sm"
    >
      <Drawer.Title title={ingredient ? "Edit Ingredient" : "New Ingredient"} />

      <Box p={2}>
        <Stack spacing={3}>
          <ControlledTextField
            control={control}
            helperText={formState.errors.name?.message}
            label="Name"
            name="name"
          />

          <IngredientNumberFields control={control} errors={formState.errors} unitType={unitType} />

          <ControlledSelect
            control={control}
            label="Group"
            name="group_id"
            options={ingredientGroups}
          />

          <ControlledSelect
            control={control}
            label="Unit Type"
            name="unit_type"
            options={unitTypeOptions}
          />

          <Stack spacing={1}>
            <LoadingButton loading={isPending} onClick={onSubmit} variant="contained">
              Save
            </LoadingButton>

            <LoadingButton color="error" loading={isPending} onClick={onClose} variant="contained">
              Close
            </LoadingButton>
          </Stack>
        </Stack>
      </Box>
    </Drawer.Root>
  );
}
