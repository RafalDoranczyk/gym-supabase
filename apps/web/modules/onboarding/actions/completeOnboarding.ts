"use server";

import { createNutritionGoals } from "@/modules/nutrition-goals";
import { markOnboardingComplete } from "@/modules/user-settings/actions/updateUserSettings";
import type {
  CreateIngredientGroupPayload,
  CreateMealTagPayload,
  NutritionGoalsForm,
} from "@repo/schemas";
import { createStarterIngredientGroups } from "./createStarterIngredientGroups";
import { createStarterIngredients } from "./createStarterIngredients";
import { createStarterMealTags } from "./createStarterMealTags";

type CompleteOnboardingProps = {
  groups: CreateIngredientGroupPayload[];
  tags: CreateMealTagPayload[];
  nutritionGoals: NutritionGoalsForm;
};

export async function completeOnboarding({
  groups,
  tags,
  nutritionGoals,
}: CompleteOnboardingProps) {
  try {
    // 1. Setup ingredient groups, tags, and ingredients
    const [{ results: ingredientGroups, errors: groupsErrors }, { errors: tagsErrors }] =
      await Promise.all([createStarterIngredientGroups(groups), createStarterMealTags(tags)]);

    const { errors } = await createStarterIngredients({ groups: ingredientGroups });

    const totalErrors = [...groupsErrors, ...tagsErrors, ...errors];

    if (totalErrors.length) console.warn("⚠️ Errors:", totalErrors);

    // 2. Save nutrition goals (if calculated)
    if (nutritionGoals.daily_calorie_target) {
      await createNutritionGoals({
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
    }

    // 3. Mark onboarding as complete
    await markOnboardingComplete();

    return { success: true };
  } catch (error) {
    console.error("Onboarding completion failed:", error);
    return { success: false, error };
  }
}
