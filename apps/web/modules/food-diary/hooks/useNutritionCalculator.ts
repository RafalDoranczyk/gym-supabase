import type { NutritionData } from "@/components";
import { roundToTwoDecimals } from "@/utils";
import type { CombinedMeal, Ingredient } from "@repo/schemas";
import { useMemo } from "react";

type MealNutrition = NutritionData & {
  mealId: string;
  mealName: string;
  mealOrder: number;
};

type UseNutritionCalculatorProps = {
  meals: CombinedMeal[];
  availableIngredients: Ingredient[];
};

export function useNutritionCalculator({
  meals,
  availableIngredients,
}: UseNutritionCalculatorProps) {
  // Cache ingredients by ID for O(1) lookup
  const ingredientMap = useMemo(() => {
    const map = new Map<string, Ingredient>();
    for (const ing of availableIngredients) {
      map.set(ing.id, ing);
    }
    return map;
  }, [availableIngredients]);

  // Calculate nutrition for single meal
  const calculateMealNutrition = useMemo(() => {
    return (meal: CombinedMeal): MealNutrition => {
      const nutrition = (meal.food_diary_ingredients ?? []).reduce(
        (total, ingredient) => ({
          calories: roundToTwoDecimals(total.calories + (ingredient.total_calories || 0)),
          protein: roundToTwoDecimals(total.protein + (ingredient.total_protein || 0)),
          carbs: roundToTwoDecimals(total.carbs + (ingredient.total_carbs || 0)),
          fat: roundToTwoDecimals(total.fat + (ingredient.total_fat || 0)),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      return {
        ...nutrition,
        mealId: meal.id || `temp-${meal.meal_order}`,
        mealName: meal.meal_name,
        mealOrder: meal.meal_order,
      };
    };
  }, []);

  // Calculate nutrition for all meals
  const mealsNutrition = useMemo(() => {
    return meals.map(calculateMealNutrition);
  }, [meals, calculateMealNutrition]);

  // Calculate total daily nutrition
  const dailyNutrition = useMemo(() => {
    return mealsNutrition.reduce(
      (total, mealNutrition) => ({
        calories: roundToTwoDecimals(total.calories + mealNutrition.calories),
        protein: roundToTwoDecimals(total.protein + mealNutrition.protein),
        carbs: roundToTwoDecimals(total.carbs + mealNutrition.carbs),
        fat: roundToTwoDecimals(total.fat + mealNutrition.fat),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [mealsNutrition]);

  // Get nutrition for specific meal
  const getMealNutrition = useMemo(() => {
    return (mealIndex: number): MealNutrition | null => {
      return mealsNutrition[mealIndex] || null;
    };
  }, [mealsNutrition]);

  // Calculate nutrition progress vs goals
  const getNutritionProgress = useMemo(() => {
    return (goals: NutritionData) => ({
      calories: {
        consumed: dailyNutrition.calories,
        goal: goals.calories,
        remaining: Math.max(0, goals.calories - dailyNutrition.calories),
        percentage: Math.round((dailyNutrition.calories / goals.calories) * 100),
      },
      protein: {
        consumed: dailyNutrition.protein,
        goal: goals.protein,
        remaining: Math.max(0, goals.protein - dailyNutrition.protein),
        percentage: Math.round((dailyNutrition.protein / goals.protein) * 100),
      },
      carbs: {
        consumed: dailyNutrition.carbs,
        goal: goals.carbs,
        remaining: Math.max(0, goals.carbs - dailyNutrition.carbs),
        percentage: Math.round((dailyNutrition.carbs / goals.carbs) * 100),
      },
      fat: {
        consumed: dailyNutrition.fat,
        goal: goals.fat,
        remaining: Math.max(0, goals.fat - dailyNutrition.fat),
        percentage: Math.round((dailyNutrition.fat / goals.fat) * 100),
      },
    });
  }, [dailyNutrition]);

  return {
    // Daily totals
    dailyNutrition,

    // Per-meal data
    mealsNutrition,
    getMealNutrition,

    // Progress tracking
    getNutritionProgress,

    // Utils
    ingredientMap,
  };
}
