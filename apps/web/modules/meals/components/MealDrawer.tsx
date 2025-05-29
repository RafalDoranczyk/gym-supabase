"use client";

import { ControlledTextField, Drawer } from "@/components";
import { useToast } from "@/providers";
import { LoadingButton } from "@mui/lab";
import { Box, Paper, Stack, Typography } from "@mui/material";
import type { Ingredient, Meal, MealTag } from "@repo/schemas";
import { useTransition } from "react";

import { createMeal } from "../actions/createMeal";
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

  const { control, errors, handleSubmit, reset, setError, watch } = useMealForm(meal, mealTags);

  const onSubmit = handleSubmit(async (payload) => {
    startTransition(() => {
      createMeal(payload)
        .then(() => {
          reset();
          toast.success("Meal saved successfully");
          onClose();
        })
        .catch((error) => {
          console.log(error);
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
      <Typography p={1} textTransform="uppercase" variant="h6">
        {meal ? "Edit Meal" : "New Meal"}
      </Typography>

      <Box bgcolor={(theme) => theme.palette.background.paper} p={3}>
        <Stack spacing={4}>
          <ControlledTextField
            control={control}
            helperText={errors.name?.message}
            label="Name"
            name="name"
          />

          <ControlledTextField
            control={control}
            helperText={errors.description?.message}
            label="Description"
            multiline
            name="description"
            rows={4}
          />

          <Paper elevation={2} sx={{ backgroundColor: "background.default", p: 2 }}>
            <MealIngredientsTable ingredients={ingredients} />
          </Paper>

          <Stack spacing={1}>
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
