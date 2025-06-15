"use client";

import type { NutritionData } from "@/components";
import type { Ingredient } from "@/modules/ingredient";
import { Grid } from "@mui/material";
import { useFoodDiary } from "../hooks/useFoodDiary";
import type { CombinedMeal } from "../schemas";
import { FoodDiaryLeftColumn } from "./FoodDiaryLeftColumn";
import { FoodDiarySidebar } from "./FoodDiarySidebar";

type FoodDiaryPageContentProps = {
  selectedDate: string;
  dailyNutrition: NutritionData;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  dailyGoals: any;
  initialMeals: CombinedMeal[];
  ingredients: Ingredient[];
};

export function FoodDiaryPageContent({
  selectedDate,
  dailyNutrition,
  dailyGoals,
  initialMeals,
  ingredients,
}: FoodDiaryPageContentProps) {
  const {
    meals,
    hasPendingChanges,
    isPending,
    isCreating,
    editingMealId,
    startCreating,
    cancelEdit,
    handleMealSave,
    handleMealDelete,
    saveAll,
    startTransition,
  } = useFoodDiary({ selectedDate, initialMeals });

  return (
    <Grid container spacing={4}>
      {/* Left Column - Main Content */}
      <Grid size={{ xs: 12, xl: 7, xxl: 5 }}>
        <FoodDiaryLeftColumn
          selectedDate={selectedDate}
          meals={meals}
          isCreating={isCreating}
          editingMealId={editingMealId}
          startCreating={startCreating}
          cancelEdit={cancelEdit}
          handleMealSave={handleMealSave}
          handleMealDelete={handleMealDelete}
          ingredients={ingredients}
          isPending={isPending}
        />
      </Grid>

      {/* Right Column - Navigation & Nutrition */}
      <Grid ml="auto" size={{ xs: 12, xl: 5 }}>
        <FoodDiarySidebar
          startTransition={startTransition}
          selectedDate={selectedDate}
          nutrition={dailyNutrition}
          dailyGoals={dailyGoals}
          hasPendingChanges={hasPendingChanges}
          isPending={isPending}
          onSaveChanges={saveAll}
        />
      </Grid>
    </Grid>
  );
}
