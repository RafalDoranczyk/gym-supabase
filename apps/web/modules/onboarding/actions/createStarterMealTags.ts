"use server";

import { createMealTagForSetup } from "@/modules/meal-tag";
import type { CreateMealTagPayload } from "@repo/schemas";

export async function createStarterMealTags(tags: CreateMealTagPayload[]) {
  const results = [];
  const errors = [];

  for (const tag of tags) {
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
