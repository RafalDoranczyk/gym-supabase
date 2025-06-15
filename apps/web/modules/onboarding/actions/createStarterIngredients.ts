"use server";

import { createIngredientForSetup } from "@/modules/ingredient";
import type { IngredientGroup } from "@repo/schemas";
import { getStarterIngredientsByGroup } from "../constants";

type CreateStarterIngredientsProps = {
  groups: IngredientGroup[];
};

export async function createStarterIngredients({ groups }: CreateStarterIngredientsProps) {
  const results = [];
  const errors = [];

  for (const group of groups) {
    const groupIngredients = getStarterIngredientsByGroup(group.name);

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
