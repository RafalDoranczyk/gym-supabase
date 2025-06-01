"use client";

import { ControlledTextField, Drawer, MultiSelect } from "@/components";
import { useToast } from "@/providers";
import { LoadingButton } from "@mui/lab";
import { Box, Paper, Stack, Typography } from "@mui/material";
import type { Ingredient, Meal, MealTag } from "@repo/schemas";
import { useTransition } from "react";

import { createMeal } from "../actions/createMeal";
import { updateMeal } from "../actions/updateMeal";

import { useMealForm } from "../forms/useMealForm";
import { MealIngredientsTable } from "./MealIngredientsTable";
import { handleFormErrors } from "@/utils";

type MealDrawerProps = {
  ingredients: Ingredient[];
  meal: Meal | null;
  mealTags: MealTag[];
  onClose: () => void;
  open: boolean;
};

export function MealDrawer({ ingredients, meal, mealTags, onClose, open }: MealDrawerProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    formState,
    handleSubmit,
    reset,
    fieldArray,
    setError,
    selectedTagIds,
    handleTagChange,
  } = useMealForm(meal);

  // Handle empty ingredients case
  if (ingredients.length === 0) {
    return (
      <Drawer.Root
        slotProps={{
          backdrop: { onClick: (event) => event.stopPropagation() },
        }}
        onClose={onClose}
        open={open}
        size="lg"
      >
        <Drawer.Title title="Setup Required" />

        <Box p={3} textAlign="center">
          <Typography variant="h6" mb={2}>
            No ingredients found
          </Typography>
          <Typography color="text.secondary" mb={3}>
            You need to create ingredients before adding meals.
          </Typography>
          <Stack spacing={2}>
            <LoadingButton variant="contained" onClick={onClose}>
              Go to Ingredients
            </LoadingButton>
            <LoadingButton variant="text" onClick={onClose}>
              Cancel
            </LoadingButton>
          </Stack>
        </Box>
      </Drawer.Root>
    );
  }

  const onSubmit = handleSubmit((payload) => {
    startTransition(() => {
      if (meal) {
        // Update existing meal
        updateMeal({
          ...payload,
          id: meal.id,
        })
          .then(() => {
            toast.success("Meal updated successfully");
            onClose();
          })
          .catch((error) => {
            handleFormErrors(error, setError, toast, {
              name: "This name already exists",
            });
          });
      } else {
        // Create new meal
        createMeal(payload)
          .then(() => {
            reset();
            toast.success("Meal saved successfully");
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

  const hasIngredients = fieldArray.fields.length > 0;

  return (
    <Drawer.Root
      slotProps={{
        backdrop: { onClick: (event) => event.stopPropagation() },
      }}
      onClose={onClose}
      open={open}
      size="lg"
    >
      <Drawer.Title title={meal ? "Edit Meal" : "New Meal"} />

      <Box p={2.5}>
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
          <MultiSelect
            label="Tags"
            options={mealTags.map((tag) => ({ id: String(tag.id), name: tag.name }))}
            value={selectedTagIds || []}
            onChange={handleTagChange}
            sx={{ width: "100%" }}
          />
          {formState.errors.tag_ids && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {formState.errors.tag_ids.message}
            </Typography>
          )}

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
            <MealIngredientsTable ingredients={ingredients} fieldArray={fieldArray} />
            {!hasIngredients && (
              <Typography variant="body2" color="text.disabled" sx={{ mt: 2, fontStyle: "italic" }}>
                Add ingredients to calculate nutrition values
              </Typography>
            )}
          </Paper>

          {/* Action buttons */}
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <LoadingButton loading={isPending} onClick={onSubmit} variant="contained" size="medium">
              {meal ? "Update Meal" : "Create Meal"}
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
