import { EmptyState } from "@/components";
import { AddRounded } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import type { CombinedMeal, Ingredient } from "@repo/schemas";
import { FoodDiaryMealForm } from "./FoodDiaryMealForm";
import { FoodDiaryMealList } from "./FoodDiaryMealList";

import type { MealSaveHandler } from "../hooks/useFoodDiaryMealForm";
import { FoodDiaryLeftColumnSkeleton } from "./loading/FoodDiaryLeftColumnSkeleton";

type FoodDiaryLeftColumnProps = {
  isCreating: boolean;
  editingMealId: string | null;
  startCreating: () => void;
  cancelEdit: () => void;
  handleMealSave: MealSaveHandler;
  handleMealDelete: (mealId: string) => Promise<void>;
  isPending: boolean;
  meals: CombinedMeal[];
  ingredients: Ingredient[];
  selectedDate: string;
};
export function FoodDiaryLeftColumn({
  isCreating,
  editingMealId,
  startCreating,
  cancelEdit,
  handleMealSave,
  handleMealDelete,
  isPending,
  meals,
  ingredients,
  selectedDate,
}: FoodDiaryLeftColumnProps) {
  if (isPending) {
    return <FoodDiaryLeftColumnSkeleton />;
  }

  const hasMeals = meals.length > 0;
  const showEmptyState = !(hasMeals || isCreating);

  if (showEmptyState) {
    return (
      <EmptyState
        type="plate"
        title="Ready to start tracking?"
        subtitle="Add your first meal today"
        action={
          <Button onClick={startCreating} variant="contained">
            Add Meal
          </Button>
        }
      />
    );
  }

  const showForm = isCreating;
  const showAddButton = hasMeals && !showForm;

  return (
    <Stack spacing={3}>
      {/* Inline Creator for new meal */}
      {isCreating && (
        <FoodDiaryMealForm
          selectedDate={selectedDate}
          availableIngredients={ingredients}
          onSave={handleMealSave}
          onCancel={cancelEdit}
        />
      )}

      {/* Meal List */}
      {hasMeals && (
        <FoodDiaryMealList
          editingMealId={editingMealId}
          selectedDate={selectedDate}
          meals={meals}
          ingredients={ingredients}
          onSave={handleMealSave}
          onDelete={handleMealDelete}
        />
      )}

      {showAddButton && (
        <Button
          variant="outlined"
          onClick={startCreating}
          startIcon={<AddRounded />}
          sx={{ alignSelf: "center" }}
        >
          Add Another Meal
        </Button>
      )}
    </Stack>
  );
}
