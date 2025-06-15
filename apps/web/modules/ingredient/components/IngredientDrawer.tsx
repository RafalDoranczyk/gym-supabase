"use client";

import { ControlledSelect, ControlledTextField, Drawer } from "@/components";
import { PATHS } from "@/constants";
import type { IngredientGroup } from "@/modules/ingredient-group";
import { useToast } from "@/providers";
import { handleFormErrors } from "@/utils";
import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo, useTransition } from "react";
import type { UseFormReturn } from "react-hook-form";
import { createIngredient, updateIngredient } from "../actions";
import { INGREDIENT_UNIT_TYPES } from "../constants";
import type { IngredientFormData } from "../schemas";
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
      <Drawer.Header>
        <Drawer.Title>Setup Required</Drawer.Title>
      </Drawer.Header>

      <Drawer.Content>
        <Stack spacing={3} textAlign="center">
          <Typography variant="h6">No ingredient groups found</Typography>
          <Typography color="text.secondary">
            You need to create at least one ingredient group before adding ingredients.
          </Typography>
          <Stack spacing={2}>
            <Link href={PATHS.LIBRARY.ROOT} passHref>
              <Button variant="contained" color="primary" onClick={onClose}>
                Create Ingredient Groups
              </Button>
            </Link>
            <Button variant="text" onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Drawer.Content>
    </Drawer.Root>
  );
}

// Memoized unit type options to prevent recreation
const unitTypeOptions = Object.entries(INGREDIENT_UNIT_TYPES).map(([id, name]) => ({
  id,
  name,
}));

type IngredientDrawerProps = {
  form: UseFormReturn<IngredientFormData>;
  onClose: () => void;
  open: boolean;
  ingredientGroups: IngredientGroup[];
};

export function IngredientDrawer({ form, onClose, open, ingredientGroups }: IngredientDrawerProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const { control, formState, handleSubmit, setError, getValues } = form;

  // Memoize mode calculation to prevent recalculation
  const id = useMemo(() => getValues("id"), [getValues]);

  if (ingredientGroups.length === 0) {
    return <SetupRequiredDrawer onClose={onClose} open={open} />;
  }

  const onSubmit = handleSubmit((payload) => {
    startTransition(async () => {
      try {
        if (id) {
          await updateIngredient({ ...payload, id });
          toast.success("Ingredient updated successfully");
          onClose();
        } else {
          await createIngredient(payload);
          toast.success("Ingredient saved successfully");
          onClose();
        }
      } catch (error) {
        handleFormErrors(error, setError, toast, {
          name: "This name already exists",
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
      <Drawer.Header>
        <Drawer.Title>{id ? "Edit Ingredient" : "New Ingredient"}</Drawer.Title>
      </Drawer.Header>

      <Drawer.Content>
        <Stack spacing={2.5}>
          <ControlledTextField
            control={control}
            helperText={formState.errors.name?.message}
            label="Name"
            name="name"
            required
          />

          <IngredientNumberFields control={control} errors={formState.errors} />

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
        </Stack>
      </Drawer.Content>

      <Drawer.Footer>
        <Stack spacing={1.5}>
          <Button loading={isPending} onClick={onSubmit} variant="contained" size="medium">
            {id ? "Update" : "Save"}
          </Button>

          <Button onClick={onClose} variant="text" disabled={isPending} size="medium">
            Cancel
          </Button>
        </Stack>
      </Drawer.Footer>
    </Drawer.Root>
  );
}
