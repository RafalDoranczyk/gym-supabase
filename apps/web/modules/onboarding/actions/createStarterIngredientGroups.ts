"use server";

import { createIngredientGroupForSetup } from "@/modules/ingredient-group";
import type { CreateIngredientGroupPayload } from "@repo/schemas";

export async function createStarterIngredientGroups(groups: CreateIngredientGroupPayload[]) {
  const results = [];
  const errors = [];

  for (const group of groups) {
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
