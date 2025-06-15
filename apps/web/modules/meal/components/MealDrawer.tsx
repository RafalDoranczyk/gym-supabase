"use client";

import { ControlledTextField, Drawer, MultiSelect } from "@/components";
import { PATHS } from "@/constants";
import type { Ingredient } from "@/modules/ingredient";
import type { MealTag } from "@/modules/meal-tag";
import { useToast } from "@/providers";
import { handleFormErrors } from "@/utils";
import { Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo, useTransition } from "react";
import type { UseFormReturn } from "react-hook-form";
import { createMeal, updateMeal } from "../actions";
import type { MealFormData } from "../schemas";
import { MealIngredientTable } from "./MealIngredientTable";

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
      size="lg"
    >
      <Drawer.Header>
        <Drawer.Title>Setup Required</Drawer.Title>
      </Drawer.Header>

      <Drawer.Content>
        <Stack spacing={3} textAlign="center">
          <Typography variant="h6">No ingredients found</Typography>
          <Typography color="text.secondary">
            You need to create ingredients before adding meals.
          </Typography>
          <Stack spacing={2}>
            <Link href={PATHS.LIBRARY.INGREDIENTS} passHref>
              <Button variant="contained" color="primary" onClick={onClose}>
                Create Ingredients
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

type MealDrawerProps = {
  form: UseFormReturn<MealFormData>;
  onClose: () => void;
  open: boolean;
  ingredients: Ingredient[];
  mealTags: MealTag[];
};

export function MealDrawer({ form, onClose, open, ingredients, mealTags }: MealDrawerProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const { control, formState, handleSubmit, reset, setError, getValues, setValue, watch } = form;

  // Memoize mode calculation to prevent recalculation
  const mode = useMemo(() => (getValues("id") ? "edit" : "create"), [getValues]);

  const selectedTagIds = watch("tag_ids") || [];

  if (ingredients.length === 0) {
    return <SetupRequiredDrawer onClose={onClose} open={open} />;
  }

  const handleTagChange = (tagIds: string[]) => {
    setValue("tag_ids", tagIds, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = handleSubmit((payload) => {
    const handleSuccess = (isEdit: boolean) => {
      reset();
      toast.success(isEdit ? "Meal updated successfully" : "Meal saved successfully");
      onClose();
    };

    const handleError = (error: unknown) => {
      handleFormErrors(error, setError, toast, {
        name: "This name already exists",
      });
    };

    startTransition(() => {
      if (mode === "edit") {
        const id = getValues("id");
        if (!id) {
          toast.error("Meal ID is missing.");
          return;
        }
        updateMeal({ ...payload, id })
          .then(() => handleSuccess(true))
          .catch(handleError);
      } else {
        createMeal(payload)
          .then(() => handleSuccess(false))
          .catch(handleError);
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
      size="lg"
    >
      <Drawer.Header>
        <Drawer.Title>{mode === "edit" ? "Edit Meal" : "New Meal"}</Drawer.Title>
      </Drawer.Header>

      <Drawer.Content>
        <Stack spacing={3}>
          {/* Basic meal information */}
          <ControlledTextField
            control={control}
            helperText={formState.errors.name?.message}
            label="Meal name"
            name="name"
            required
          />

          <ControlledTextField
            control={control}
            helperText={formState.errors.description?.message}
            label="Meal description"
            multiline
            name="description"
            rows={3}
            placeholder="Optional description of your meal..."
          />

          {/* Tag selection */}
          <Stack spacing={0.5}>
            <MultiSelect
              label="Tags"
              options={mealTags.map((tag) => ({ id: String(tag.id), name: tag.name }))}
              value={selectedTagIds}
              onChange={handleTagChange}
              sx={{ width: "100%" }}
            />
            {formState.errors.tag_ids && (
              <Typography variant="caption" color="error">
                {formState.errors.tag_ids.message}
              </Typography>
            )}
          </Stack>

          {/* Ingredients section */}
          <Paper
            elevation={1}
            sx={{
              backgroundColor: "background.paper",
              border: 1,
              borderColor: "divider",
              p: 2.5,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Ingredients
            </Typography>
            <MealIngredientTable
              ingredients={ingredients}
              control={control}
              errors={formState.errors}
            />
          </Paper>
        </Stack>
      </Drawer.Content>

      <Drawer.Footer>
        <Stack spacing={1.5}>
          <Button loading={isPending} onClick={onSubmit} variant="contained" size="medium">
            {mode === "edit" ? "Update" : "Save"}
          </Button>

          <Button onClick={onClose} variant="text" disabled={isPending} size="medium">
            Cancel
          </Button>
        </Stack>
      </Drawer.Footer>
    </Drawer.Root>
  );
}
