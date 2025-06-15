"use server";

import { createIngredientForSetup } from "@/modules/ingredient";
import {
  createIngredientGroupForSetup,
  type CreateIngredientGroupPayload,
  type IngredientGroup,
} from "@/modules/ingredient-group";
import { createMealTagForSetup, type CreateMealTagPayload } from "@/modules/meal-tag";
import { createNutritionGoals, type NutritionGoalsForm } from "@/modules/nutrition-goals";
import { markOnboardingComplete } from "@/modules/user-settings";
import { getStarterIngredientsByGroup } from "../constants";

type SetupError = {
  type: "group" | "tag" | "ingredient" | "nutrition";
  name: string;
  error: unknown;
};

type SetupResult<T> = {
  results: T[];
  errors: SetupError[];
};

async function createStarterIngredientGroups(
  groups: CreateIngredientGroupPayload[]
): Promise<SetupResult<IngredientGroup>> {
  const results: IngredientGroup[] = [];
  const errors: SetupError[] = [];

  for (const group of groups) {
    try {
      const result = await createIngredientGroupForSetup(group);
      results.push(result);
    } catch (error) {
      console.error(`Failed to create group ${group.name}:`, error);
      errors.push({ type: "group", name: group.name, error });
    }
  }

  return { results, errors };
}

async function createStarterMealTags(tags: CreateMealTagPayload[]): Promise<SetupResult<any>> {
  const results = [];
  const errors: SetupError[] = [];

  for (const tag of tags) {
    try {
      const result = await createMealTagForSetup(tag);
      results.push(result);
    } catch (error) {
      console.error(`Failed to create tag ${tag.name}:`, error);
      errors.push({ type: "tag", name: tag.name, error });
    }
  }

  return { results, errors };
}

async function createStarterIngredients(groups: IngredientGroup[]): Promise<SetupResult<any>> {
  const results = [];
  const errors: SetupError[] = [];

  for (const group of groups) {
    const groupIngredients = getStarterIngredientsByGroup(group.name);

    if (!groupIngredients?.length) {
      continue; // Skip if no ingredients for this group
    }

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
        errors.push({ type: "ingredient", name: ingredient.name, error });
      }
    }
  }

  return { results, errors };
}

async function createNutritionGoalsFromSurvey(nutritionGoals: NutritionGoalsForm) {
  try {
    return await createNutritionGoals({
      current_phase: nutritionGoals.current_phase,
      activity_level: nutritionGoals.activity_level,
      target_weight: nutritionGoals.target_weight,
      daily_calorie_target: nutritionGoals.daily_calorie_target,
      daily_protein_target: nutritionGoals.daily_protein_target,
      daily_carbs_target: nutritionGoals.daily_carbs_target,
      daily_fat_target: nutritionGoals.daily_fat_target,
      weekly_weight_change_target: nutritionGoals.weekly_weight_change_target,
      current_phase_start_date: new Date().toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Failed to create nutrition goals:", error);
    throw error; // Re-throw to be handled in main function
  }
}

type CompleteOnboardingProps = {
  groups: CreateIngredientGroupPayload[];
  tags: CreateMealTagPayload[];
  nutritionGoals: NutritionGoalsForm;
};

type OnboardingResult = {
  success: boolean;
  errors?: SetupError[];
  totalCreated?: {
    groups: number;
    tags: number;
    ingredients: number;
  };
  error?: unknown;
};

export async function completeOnboarding({
  groups,
  tags,
  nutritionGoals,
}: CompleteOnboardingProps): Promise<OnboardingResult> {
  try {
    console.log("🚀 Starting onboarding setup...");

    // 1. Create nutrition goals first (critical step)
    await createNutritionGoalsFromSurvey(nutritionGoals);
    console.log("✅ Nutrition goals created");

    // 2. Setup ingredient groups and tags in parallel
    const [
      { results: ingredientGroups, errors: groupsErrors },
      { results: mealTags, errors: tagsErrors },
    ] = await Promise.all([createStarterIngredientGroups(groups), createStarterMealTags(tags)]);

    console.log(`✅ Created ${ingredientGroups.length} groups, ${mealTags.length} tags`);

    // 3. Create ingredients based on created groups
    const { results: ingredients, errors: ingredientErrors } =
      await createStarterIngredients(ingredientGroups);
    console.log(`✅ Created ${ingredients.length} ingredients`);

    // 4. Collect all errors
    const allErrors = [...groupsErrors, ...tagsErrors, ...ingredientErrors];

    // 5. Log summary
    if (allErrors.length > 0) {
      console.warn(`⚠️ Onboarding completed with ${allErrors.length} errors:`, allErrors);
    } else {
      console.log("🎉 Onboarding setup completed successfully!");
    }

    // 6. Mark onboarding as complete (even if there were some errors)
    await markOnboardingComplete();
    console.log("✅ Onboarding marked as complete");

    return {
      success: true,
      errors: allErrors.length > 0 ? allErrors : undefined,
      totalCreated: {
        groups: ingredientGroups.length,
        tags: mealTags.length,
        ingredients: ingredients.length,
      },
    };
  } catch (error) {
    console.error("❌ Onboarding completion failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
