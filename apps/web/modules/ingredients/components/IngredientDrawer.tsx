"use client";

import { ControlledSelect, ControlledTextField, Drawer } from "@/components";
import { useToast } from "@/providers";
import { handleFormErrors } from "@/utils";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, Typography } from "@mui/material";
import { INGREDIENT_UNIT_TYPES, type NutritionGroup } from "@repo/schemas";
import Link from "next/link";

import { useTransition } from "react";
import type { UseFormReturn } from "react-hook-form";

import { createIngredient } from "../actions/createIngredient";
import { updateIngredient } from "../actions/updateIngredient";
import type { IngredientForm } from "../hooks/useIngredientForm";
import { IngredientNumberFields } from "./IngredientNumberFields";

type SetupRequiredDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function SetupRequiredDrawer({ onClose, open }: SetupRequiredDrawerProps) {
  return (
    <Drawer.Root
      slotProps={{
        backdrop: {
          onClick: (event) => event.stopPropagation(),
        },
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
          <Link href="/dashboard/data-management" passHref>
            <Button variant="contained" color="primary" onClick={onClose}>
              Create Ingredient Groups
            </Button>
          </Link>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Drawer.Root>
  );
}

const unitTypeOptions = Object.entries(INGREDIENT_UNIT_TYPES).map(([id, name]) => ({
  id,
  name,
}));

type IngredientDrawerProps = {
  form: UseFormReturn<IngredientForm>;
  onClose: () => void;
  open: boolean;
  ingredientGroups: NutritionGroup[];
};

export function IngredientDrawer({ form, onClose, open, ingredientGroups }: IngredientDrawerProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  if (ingredientGroups.length === 0) {
    return <SetupRequiredDrawer onClose={onClose} open={open} />;
  }

  const { control, formState, handleSubmit, reset, setError, watch, getValues } = form;
  const mode = getValues("id") ? "edit" : "create";

  const unitType = watch("unit_type");

  const onSubmit = handleSubmit((payload) => {
    startTransition(() => {
      if (mode === "edit") {
        const id = getValues("id");
        updateIngredient({ ...payload, id })
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
      slotProps={{
        backdrop: {
          onClick: (event) => event.stopPropagation(),
        },
      }}
      onClose={onClose}
      open={open}
      size="sm"
    >
      <Drawer.Title title={mode === "edit" ? "Edit Ingredient" : "New Ingredient"} />

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
            errorMessage={formState.errors.group_id?.message}
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
              {mode === "edit" ? "Update" : "Save"}
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
