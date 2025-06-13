"use server";

import { createMealTagForSetup, STARTER_MEAL_TAGS } from "@/modules/meal-tag";

export async function createStarterMealTags() {
  const results = [];
  const errors = [];

  for (const tag of STARTER_MEAL_TAGS) {
    try {
      const result = await createMealTagForSetup(tag);
      results.push(result);
    } catch (error) {
      console.error(`Failed to create tag ${tag.name}:`, error);
      errors.push({ group: tag.name, error });
    }
  }

  return { results, errors };
}
