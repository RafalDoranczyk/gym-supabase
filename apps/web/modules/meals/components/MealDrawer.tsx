"use client";

import { ControlledTextField, Drawer } from "@/components";
import { useToast } from "@/providers";
import { LoadingButton } from "@mui/lab";
import { Box, Paper, Stack, Typography } from "@mui/material";
import type { Ingredient, Meal, MealTag } from "@repo/schemas";
import { useTransition } from "react";

import { createMeal } from "../actions/createMeal";
import { handleCreateMealError } from "../forms/errorHandlers";
import { useMealForm } from "../forms/useMealForm";
import { MealIngredientsTable } from "./MealIngredientsTable";

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

  const { control, formState, handleSubmit, reset, fieldArray, setError } = useMealForm(
    meal,
    mealTags,
  );

  const onSubmit = handleSubmit((payload) => {
    startTransition(() => {
      createMeal(payload)
        .then(() => {
          reset();
          toast.success("Meal saved successfully");
          onClose();
        })
        .catch((error) => {
          handleCreateMealError(error, setError);
        });
    });
  });

  return (
    <Drawer.Root
      BackdropProps={{ onClick: (event) => event.stopPropagation() }}
      onClose={onClose}
      open={open}
      size="lg"
    >
      <Box p={3}>
        <Typography p={1} textTransform="uppercase" variant="h6">
          {meal ? "Edit Meal" : "New Meal"}
        </Typography>
        <Stack spacing={4}>
          <ControlledTextField
            control={control}
            helperText={formState.errors.name?.message}
            label="Meal name"
            name="name"
          />

          <ControlledTextField
            control={control}
            helperText={formState.errors.description?.message}
            label="Meal description"
            multiline
            name="description"
            rows={4}
          />

          <Paper elevation={2} sx={{ backgroundColor: "background.default", p: 2 }}>
            <MealIngredientsTable ingredients={ingredients} fieldArray={fieldArray} />
          </Paper>

          <Stack spacing={2}>
            <LoadingButton loading={isPending} onClick={onSubmit} variant="contained">
              Save
            </LoadingButton>

            <LoadingButton color="error" loading={isPending} onClick={onClose} variant="outlined">
              Close
            </LoadingButton>
          </Stack>
        </Stack>
      </Box>
    </Drawer.Root>
  );
}
