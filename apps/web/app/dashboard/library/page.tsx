import {
  fetchIngredientGroupsWithExamples,
  IngredientsGroupPageContent,
} from "@/modules/ingredient-groups";
import { fetchMealTagsWithExamples, MealTagsPageContent } from "@/modules/meal-tags";

import { Divider, Stack } from "@mui/material";

export default async function DataManagement() {
  const [ingredientGroups, mealTags] = await Promise.all([
    fetchIngredientGroupsWithExamples(),
    fetchMealTagsWithExamples(),
  ]);

  return (
    <Stack spacing={4}>
      {/* Ingredient Groups Section */}
      <IngredientsGroupPageContent ingredientGroups={ingredientGroups.data} />

      <Divider />

      {/* Meal Tags Section */}
      <MealTagsPageContent mealTags={mealTags.data} />
    </Stack>
  );
}
