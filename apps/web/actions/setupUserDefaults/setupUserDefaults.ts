"use server";
import { createStarterIngredientGroups } from "./createStarterIngredientGroups";
import { createStarterIngredients } from "./createStarterIngredients";
import { createStarterMealTags } from "./createStarterMealTags";

export async function setupUserDefaults() {
  try {
    const [{ results: ingredientGroups, errors: groupsErrors }, { errors: tagsErrors }] =
      await Promise.all([createStarterIngredientGroups(), createStarterMealTags()]);

    const { errors } = await createStarterIngredients(ingredientGroups);

    const totalErrors = [...groupsErrors, ...tagsErrors, ...errors];

    if (totalErrors.length) console.warn("⚠️ Errors:", totalErrors);

    return {
      success: true,
      errors: totalErrors.length ? totalErrors : undefined,
    };
  } catch (error) {
    console.error("❌ Setup failed:", error);
    return { success: false, error };
  }
}
