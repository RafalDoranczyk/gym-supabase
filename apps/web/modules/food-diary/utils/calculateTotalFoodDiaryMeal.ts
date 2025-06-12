import { roundToTwoDecimals } from "@/utils";
import type { FoodDiaryIngredient } from "@repo/schemas";

export const calculateTotalFoodDiaryMeal = (ingredients?: FoodDiaryIngredient[]) =>
  ingredients?.reduce(
    (total, ingredient) => ({
      calories: roundToTwoDecimals(total.calories + ingredient.total_calories),
      protein: roundToTwoDecimals(total.protein + (ingredient.total_protein ?? 0)),
      carbs: roundToTwoDecimals(total.carbs + (ingredient.total_carbs ?? 0)),
      fat: roundToTwoDecimals(total.fat + (ingredient.total_fat ?? 0)),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
