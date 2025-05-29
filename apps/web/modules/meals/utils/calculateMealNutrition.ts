import type { MealIngredient } from "@repo/schemas";

const getFactor = (amount: number, unit: string) =>
  unit === "g" ? amount / 100 : unit === "kg" ? amount * 10 : amount;

const round = (value: number) => +value.toFixed(2);

export function calculateMealIngredientNutrition({ amount, ingredient }: MealIngredient) {
  const f = getFactor(amount, ingredient.unit_type);
  return {
    calories: round(ingredient.calories * f),
    carbs: round(ingredient.carbs * f),
    fat: round(ingredient.fat * f),
    price: round((ingredient.price ?? 0) * f),
    protein: round(ingredient.protein * f),
  };
}

export function calculateMealNutrition(mealIngredients: MealIngredient[]) {
  const total = mealIngredients.reduce(
    (acc, { amount, ingredient }) => {
      const f = getFactor(amount, ingredient.unit_type);
      acc.calories += ingredient.calories * f;
      acc.carbs += ingredient.carbs * f;
      acc.protein += ingredient.protein * f;
      acc.fat += ingredient.fat * f;
      acc.price += (ingredient.price ?? 0) * f;
      return acc;
    },
    { calories: 0, carbs: 0, fat: 0, price: 0, protein: 0 },
  );

  return {
    calories: round(total.calories),
    carbs: round(total.carbs),
    fat: round(total.fat),
    price: round(total.price),
    protein: round(total.protein),
  };
}
