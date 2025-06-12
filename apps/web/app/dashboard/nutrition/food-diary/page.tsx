import { fetchFoodDiaryDay, FoodDiaryPageContent } from "@/modules/food-diary";
import { fetchIngredients } from "@/modules/ingredient";
import { cleanSearchParams, getTodayDateString } from "@/utils";

// Daily goals - hardcoded for now
const DAILY_GOALS = {
  calories: 2200,
  protein: 150,
  carbs: 220,
  fat: 73,
};

type FoodDiaryProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function FoodDiary({ searchParams }: FoodDiaryProps) {
  const params = await searchParams;
  // Get selected date from URL params or default to today
  const cleanedParams = await cleanSearchParams(params);
  const selectedDate = cleanedParams?.date || getTodayDateString();

  const [{ data: ingredients }, { meals, daily_summary }] = await Promise.all([
    fetchIngredients(),
    fetchFoodDiaryDay({ entry_date: selectedDate }),
  ]);

  // Transform daily summary to match component interface
  const dailyNutrition = {
    calories: daily_summary?.daily_calories || 0,
    protein: daily_summary?.daily_protein || 0,
    carbs: daily_summary?.daily_carbs || 0,
    fat: daily_summary?.daily_fat || 0,
  };

  return (
    <FoodDiaryPageContent
      ingredients={ingredients}
      initialMeals={meals}
      dailyGoals={DAILY_GOALS}
      dailyNutrition={dailyNutrition}
      selectedDate={selectedDate}
    />
  );
}
