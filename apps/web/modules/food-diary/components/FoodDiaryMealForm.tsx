"use client";

import { type NutritionData, TooltipIconButton } from "@/components";
import type { Ingredient } from "@/modules/ingredient";
import { AddRounded, EditRounded, RestaurantRounded } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Fade,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { type MealSaveHandler, useFoodDiaryMealForm } from "../hooks/useFoodDiaryMealForm";
import type { CombinedMeal } from "../schemas";

type FoodDiaryMealFormProps = {
  meal?: CombinedMeal;
  availableIngredients: Ingredient[];
  onSave: MealSaveHandler;
  onCancel: () => void;
  selectedDate: string;
  onNutritionUpdate?: (mealId: string, nutrition: NutritionData) => void;
};

export function FoodDiaryMealForm({
  meal,
  availableIngredients,
  onSave,
  onCancel,
  selectedDate,
}: FoodDiaryMealFormProps) {
  const {
    form,
    fields,
    watchedIngredients,
    totalNutrition,
    isEditing,
    availableOptions,
    findIngredientById,
    handleAddIngredient,
    updateIngredientNutrition,
    handleSave,
    handleCancel,
    removeIngredient,
  } = useFoodDiaryMealForm({
    meal,
    selectedDate,
    availableIngredients,
    onSave,
    onCancel,
  });

  const { register, formState } = form;

  // Debounced nutrition update
  const debouncedUpdateNutrition = useDebouncedCallback(
    (index: number, newQuantity: number, ingredientId: string) => {
      updateIngredientNutrition(index, newQuantity, ingredientId);
    },
    300
  );

  const handleQuantityChange =
    (index: number, ingredientId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = Number(event.target.value);
      form.setValue(`ingredients.${index}.quantity`, newQuantity);
      debouncedUpdateNutrition(index, newQuantity, ingredientId);
    };

  const mealNameError = formState.errors.meal_name;
  const hasIngredients = fields.length > 0;

  return (
    <Fade in>
      <Paper component="form" onSubmit={handleSave} sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Header */}
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: isEditing ? "warning.main" : "primary.main", color: "white" }}>
              {isEditing ? <EditRounded /> : <RestaurantRounded />}
            </Avatar>

            <Box flex={1}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {isEditing ? "Edit Meal" : "Add New Meal"}
              </Typography>
              <TextField
                {...register("meal_name")}
                placeholder="Enter meal name (e.g., Breakfast, Lunch...)"
                error={!!mealNameError}
                helperText={mealNameError?.message}
                fullWidth
                size="small"
              />
            </Box>
          </Box>

          {/* Add Ingredient Search */}
          <Autocomplete
            getOptionLabel={({ name }) => name}
            onChange={(_, newValue) => handleAddIngredient(newValue)}
            options={availableOptions}
            value={null}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search and add ingredients..."
                variant="outlined"
                size="small"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: <AddRounded sx={{ mr: 1, color: "text.secondary" }} />,
                  },
                }}
              />
            )}
          />

          {/* Selected Ingredients */}
          {hasIngredients && (
            <>
              <Stack spacing={2}>
                {fields.map((field, index) => {
                  const ingredient = findIngredientById(field.ingredient_id);
                  if (!ingredient) return null;

                  const watchedField = watchedIngredients[index];
                  const nutrition = {
                    calories: watchedField?.total_calories || 0,
                    protein: watchedField?.total_protein || 0,
                    carbs: watchedField?.total_carbs || 0,
                    fat: watchedField?.total_fat || 0,
                  };

                  return (
                    <Box
                      key={field.id}
                      p={2}
                      borderRadius={1}
                      gap={2}
                      bgcolor="action.hover"
                      display="flex"
                      alignItems="center"
                    >
                      <Box flex={1}>
                        <Typography variant="body1" fontWeight="medium">
                          {ingredient.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {nutrition.calories} kcal • {nutrition.protein}g protein •{" "}
                          {nutrition.carbs}g carbs • {nutrition.fat}g fat
                        </Typography>
                      </Box>

                      <TextField
                        type="number"
                        size="small"
                        value={watchedField?.quantity || 0}
                        onChange={handleQuantityChange(index, field.ingredient_id)}
                        sx={{ width: "100px" }}
                        // slotProps={{
                        //   htmlInput: {
                        //     min: 0.1, // avoid 0 quantities
                        //     // step: ingredient.unit_type === "g" ? 1 : 0.1,
                        //   },
                        // }}
                      />
                      <Typography minWidth="30px" variant="caption" color="text.secondary">
                        {ingredient.unit_type}
                      </Typography>
                      <TooltipIconButton
                        size="small"
                        onClick={() => removeIngredient(index)}
                        variant="delete"
                      />
                    </Box>
                  );
                })}
              </Stack>

              <Divider />
              {/* Nutrition Summary */}
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={`${totalNutrition.calories} kcal`}
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                  }}
                />
                <Chip label={`${totalNutrition.protein}g protein`} variant="outlined" />
                <Chip label={`${totalNutrition.carbs}g carbs`} variant="outlined" />
                <Chip label={`${totalNutrition.fat}g fat`} variant="outlined" />
              </Box>
            </>
          )}

          {!hasIngredients && (
            <Box
              textAlign="center"
              py={3}
              bgcolor="action.hover"
              borderRadius={1}
              border={1}
              borderColor="divider"
              sx={{
                borderStyle: "dashed",
              }}
            >
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                Add ingredients to calculate nutrition values
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button type="button" variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color={isEditing ? "warning" : "primary"}>
              {isEditing ? "Update Meal" : "Save Meal"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Fade>
  );
}
