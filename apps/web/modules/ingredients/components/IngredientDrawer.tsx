"use client";

import { ControlledSelect, ControlledTextField, Drawer } from "@/components";
import { useToast } from "@/providers";
import { handleFormErrors } from "@/utils";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, Typography } from "@mui/material";
import { INGREDIENT_UNIT_TYPES, type Ingredient, type NutritionGroup } from "@repo/schemas";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { createIngredient } from "../actions/createIngredient";
import { updateIngredient } from "../actions/updateIngredient";
import { useIngredientForm } from "../hooks/useIngredientForm";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Handle empty groups case
  if (ingredientGroups.length === 0) {
    return (
      <Drawer.Root
        BackdropProps={{
          onClick: (event) => event.stopPropagation(),
        }}
        onClose={onClose}
        open={open}
        size="sm"
      >
        <Drawer.Title title="Setup Required" />

        <Box p={3} textAlign="center">
          <Typography variant="h6" mb={2}>
            No ingredient groups found
          </Typography>
          <Typography color="text.secondary" mb={3}>
            You need to create at least one ingredient group before adding ingredients.
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                router.push("/dashboard/data-management");
                onClose();
              }}
            >
              Create Ingredient Groups
            </Button>
            <Button variant="text" onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Drawer.Root>
    );
  }

  // Normal form when groups exist
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
            reset();
            toast.success("Ingredient updated successfully");
            onClose();
          })
          .catch((error) => {
            handleFormErrors(error, setError, toast, {
              name: "This name already exists",
            });
          });
      } else {
        createIngredient(payload)
          .then(() => {
            reset();
            toast.success("Ingredient saved successfully");
            onClose();
          })
          .catch((error) => {
            handleFormErrors(error, setError, toast, {
              name: "This name already exists",
            });
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

      <Box p={2.5}>
        <Stack spacing={2.5}>
          <ControlledTextField
            control={control}
            helperText={formState.errors.name?.message}
            label="Name"
            name="name"
            required
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

          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <LoadingButton loading={isPending} onClick={onSubmit} variant="contained" size="medium">
              {ingredient ? "Update" : "Save"}
            </LoadingButton>

            <LoadingButton onClick={onClose} variant="text" disabled={isPending} size="medium">
              Cancel
            </LoadingButton>
          </Stack>
        </Stack>
      </Box>
    </Drawer.Root>
  );
}
