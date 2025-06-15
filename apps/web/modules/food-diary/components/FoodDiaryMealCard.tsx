import { type NutritionData, TooltipIconButton } from "@/components";
import type { Ingredient } from "@/modules/ingredient";
import { Avatar, Box, Card, Chip, Typography } from "@mui/material";
import { useState } from "react";
import type { MealSaveHandler } from "../hooks/useFoodDiaryMealForm";
import type {
  CombinedMeal,
  CreateFoodDiaryMealPayload,
  FoodDiaryIngredient,
  UpdateFoodDiaryMealPayload,
} from "../schemas";
import { FoodDiaryMealForm } from "./FoodDiaryMealForm";

function NutritionChipSummary({ calories, protein, carbs, fat }: NutritionData) {
  return (
    <Box display="flex" gap={0.5} flexWrap="wrap" alignItems="center">
      <Chip label={`${calories} kcal`} size="small" color="primary" sx={{ fontWeight: "bold" }} />
      <Chip label={`${protein}g protein`} size="small" variant="outlined" />
      <Chip label={`${carbs}g carbs`} size="small" variant="outlined" />
      <Chip label={`${fat}g fat`} size="small" variant="outlined" />
    </Box>
  );
}

function IngredientItem({
  ingredient,
  availableIngredients,
}: {
  ingredient: FoodDiaryIngredient;
  availableIngredients: Ingredient[];
}) {
  const ingredientData = availableIngredients.find((ing) => ing.id === ingredient.ingredient_id);

  if (!ingredientData) {
    return (
      <Box
        p={1.5}
        bgcolor="action.hover"
        borderRadius={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <div>
          <Typography variant="body2" fontWeight="medium" color="text.secondary">
            Unknown Ingredient
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {ingredient.quantity}g
          </Typography>
        </div>
        <NutritionChipSummary
          calories={ingredient.total_calories}
          fat={ingredient.total_fat || 0}
          carbs={ingredient.total_carbs || 0}
          protein={ingredient.total_protein || 0}
        />
      </Box>
    );
  }

  return (
    <Box
      p={1.5}
      bgcolor="action.hover"
      borderRadius={1}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <div>
        <Typography variant="body2" fontWeight="medium">
          {ingredientData.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {ingredient.quantity}
          {ingredientData.unit_type}
        </Typography>
      </div>

      <NutritionChipSummary
        calories={ingredient.total_calories}
        fat={ingredient.total_fat || 0}
        carbs={ingredient.total_carbs || 0}
        protein={ingredient.total_protein || 0}
      />
    </Box>
  );
}

type FoodDiaryMealCardProps = {
  meal: CombinedMeal;
  availableIngredients: Ingredient[];
  onSave: MealSaveHandler;
  onDelete: (mealId: string) => Promise<void>;
  selectedDate: string;
};

export function FoodDiaryMealCard({
  meal,
  availableIngredients,
  onSave,
  onDelete,
  selectedDate,
}: FoodDiaryMealCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Use pre-calculated totals from meal_nutrition_summary view
  const totalNutrition: NutritionData = {
    calories: meal.total_calories,
    protein: meal.total_protein,
    carbs: meal.total_carbs,
    fat: meal.total_fat,
  };

  if (isEditing) {
    const handleSave = async (
      data: UpdateFoodDiaryMealPayload | CreateFoodDiaryMealPayload,
      isNew: boolean
    ) => {
      await onSave(data, isNew);
      setIsEditing(false);
    };

    return (
      <FoodDiaryMealForm
        meal={meal}
        selectedDate={selectedDate}
        availableIngredients={availableIngredients}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const handleDelete = async () => {
    await onDelete(meal.id);
  };

  return (
    <Card
      sx={{
        p: 2.5,
      }}
    >
      {/* Meal Header */}
      <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            fontSize: "0.875rem",
            fontWeight: "bold",
            bgcolor: "primary.main",
            transition: "all 0.2s ease-in-out",
          }}
        >
          {meal.meal_order}
        </Avatar>

        <div>
          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            {meal.meal_name}
            {isEditing && (
              <Chip
                label="Editable"
                size="small"
                color="warning"
                variant="outlined"
                sx={{ ml: 1, fontSize: "0.625rem" }}
              />
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {totalNutrition.calories} kcal total
            {isEditing && " • Click edit to modify"}
          </Typography>
        </div>

        <Box ml="auto" display="flex" alignItems="center" gap={0.5}>
          <TooltipIconButton variant="edit" onClick={() => setIsEditing(true)} size="small" />
          <TooltipIconButton variant="delete" onClick={handleDelete} size="small" />
        </Box>
      </Box>

      {/* Nutrition Summary */}
      <Box mb={1.5}>
        <NutritionChipSummary {...totalNutrition} />
      </Box>

      {/* Divider */}
      <Box height={1} my={1.5} bgcolor="divider" />

      {/* Ingredients */}
      <Box display="flex" flexDirection="column" gap={0.75}>
        {meal.food_diary_ingredients?.length ? (
          meal.food_diary_ingredients.map((ingredient, index) => (
            <IngredientItem
              key={`${ingredient.ingredient_id}-${index}`}
              ingredient={ingredient}
              availableIngredients={availableIngredients}
            />
          ))
        ) : (
          <Box
            textAlign="center"
            py={2}
            bgcolor="action.hover"
            borderRadius={1}
            border={1}
            borderColor="divider"
            sx={{ borderStyle: "dashed" }}
          >
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              No ingredients added yet
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
