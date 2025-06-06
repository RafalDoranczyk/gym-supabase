import { PageHeader } from "@/components";
import {
  fetchIngredientGroupsWithExamples,
  IngredientGroupsPageContent,
} from "@/modules/ingredient-groups";
import { fetchMealTagsWithExamples, MealTagsPageContent } from "@/modules/meal-tags";

import { Divider, Stack } from "@mui/material";

export default async function LibraryPage() {
  const [{ data: ingredientGroups }, { data: mealTags }] = await Promise.all([
    fetchIngredientGroupsWithExamples(),
    fetchMealTagsWithExamples(),
  ]);

  return (
    <Stack spacing={4}>
      <PageHeader
        title="Library"
        description="Manage ingredient groups, meal categories, and measurement types for your nutrition tracking."
      />
      <Divider />
      <IngredientGroupsPageContent ingredientGroups={ingredientGroups} />
      <Divider />
      <MealTagsPageContent mealTags={mealTags} />
    </Stack>
  );
}
