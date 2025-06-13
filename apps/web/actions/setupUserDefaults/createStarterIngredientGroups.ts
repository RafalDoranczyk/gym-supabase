"use server";

import {
  createIngredientGroupForSetup,
  INGREDIENT_STARTER_GROUPS,
} from "@/modules/ingredient-group";

export async function createStarterIngredientGroups() {
  const results = [];
  const errors = [];

  for (const group of INGREDIENT_STARTER_GROUPS) {
    try {
      const result = await createIngredientGroupForSetup(group);
      results.push(result);
    } catch (error) {
      console.error(`Failed to create group ${group.name}:`, error);
      errors.push({ group: group.name, error });
    }
  }

  return { results, errors };
}
