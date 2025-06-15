import type { Ingredient } from "@/modules/ingredient";
import { Grid, Stack } from "@mui/material";
import type { MealSaveHandler } from "../hooks/useFoodDiaryMealForm";
import type { CombinedMeal } from "../schemas";
import { FoodDiaryMealCard } from "./FoodDiaryMealCard";

type FoodDiaryMealListProps = {
  meals: CombinedMeal[];
  editingMealId: string | null;
  selectedDate: string;
  ingredients: Ingredient[];
  onSave: MealSaveHandler;
  onDelete: (id: string) => Promise<void>;
};

export function FoodDiaryMealList({
  meals,
  editingMealId,
  selectedDate,
  ingredients,
  onSave,
  onDelete,
}: FoodDiaryMealListProps) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {meals.map((meal) => {
          // Skip the meal that's currently being edited inline
          if (editingMealId === meal.id) return null;

          return (
            <Grid key={meal.id} size={{ xs: 12 }}>
              <FoodDiaryMealCard
                selectedDate={selectedDate}
                meal={meal}
                availableIngredients={ingredients}
                onSave={onSave}
                onDelete={onDelete}
              />
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}
