"use server";

import { createIngredientForSetup, INGREDIENT_STARTER_ITEMS } from "@/modules/ingredient";
import type { IngredientGroup } from "@repo/schemas";

export async function createStarterIngredients(createdGroups: IngredientGroup[]) {
  const results = [];
  const errors = [];

  for (const group of createdGroups) {
    const groupIngredients =
      INGREDIENT_STARTER_ITEMS[group.name as keyof typeof INGREDIENT_STARTER_ITEMS];

    if (groupIngredients) {
      for (const ingredient of groupIngredients) {
        try {
          const result = await createIngredientForSetup({
            name: ingredient.name,
            calories: ingredient.calories,
            protein: ingredient.protein,
            carbs: ingredient.carbs,
            fat: ingredient.fat,
            unit_type: "g" as const,
            group_id: group.id,
          });
          results.push(result);
        } catch (error) {
          console.error(`Failed to create ingredient ${ingredient.name}:`, error);
          errors.push({ ingredient: ingredient.name, error });
        }
      }
    }
  }

  return { results, errors };
}
