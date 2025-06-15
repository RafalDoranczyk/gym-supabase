import { roundToTwoDecimals } from "@/utils";
import type { MealIngredient } from "../schemas";

/**
 * Unit conversion multipliers for scaling nutrition values
 * Nutrition values are typically stored per 100g
 */
const NUTRITION_UNIT_MULTIPLIERS = {
  g: 0.01, // grams: divide by 100
  kg: 10, // kilograms: multiply by 10
} as const;

/**
 * Calculates multiplication factor based on ingredient amount and unit
 */
const getUnitMultiplier = (amount: number, unit: string): number => {
  const unitMultiplier =
    NUTRITION_UNIT_MULTIPLIERS[unit as keyof typeof NUTRITION_UNIT_MULTIPLIERS] ?? 1;
  return amount * unitMultiplier;
};

/**
 * Scales base nutrition values by a given multiplier
 */
const scaleNutritionByAmount = (
  {
    calories,
    carbs,
    protein,
    fat,
    price = 0,
  }: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    price?: number;
  },
  multiplier: number
) => ({
  calories: roundToTwoDecimals(calories * multiplier),
  carbs: roundToTwoDecimals(carbs * multiplier),
  protein: roundToTwoDecimals(protein * multiplier),
  fat: roundToTwoDecimals(fat * multiplier),
  price: roundToTwoDecimals(price * multiplier),
});

/**
 * Calculates nutrition values for a single meal ingredient
 */
export function calculateIngredientNutrition({ amount, ingredient }: MealIngredient) {
  const multiplier = getUnitMultiplier(amount, ingredient.unit_type);
  return scaleNutritionByAmount(ingredient, multiplier);
}

/**
 * Calculates total nutrition values for an entire meal by summing all ingredients
 */
export function calculateTotalMealNutrition(mealIngredients: MealIngredient[]) {
  const total = mealIngredients.reduce(
    (acc, { amount, ingredient }) => {
      const multiplier = getUnitMultiplier(amount, ingredient.unit_type);
      const nutrition = scaleNutritionByAmount(ingredient, multiplier);

      acc.calories += nutrition.calories;
      acc.carbs += nutrition.carbs;
      acc.protein += nutrition.protein;
      acc.fat += nutrition.fat;
      acc.price += nutrition.price;

      return acc;
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0, price: 0 }
  );

  return {
    calories: roundToTwoDecimals(total.calories),
    carbs: roundToTwoDecimals(total.carbs),
    protein: roundToTwoDecimals(total.protein),
    fat: roundToTwoDecimals(total.fat),
    price: roundToTwoDecimals(total.price),
  };
}
