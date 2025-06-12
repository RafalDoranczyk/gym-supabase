import { PageHeader } from "@/components";
import {
  fetchIngredientGroupsWithExamples,
  IngredientGroupPageContent,
} from "@/modules/ingredient-group";
import { fetchMealTagsWithExamples, MealTagPageContent } from "@/modules/meal-tag";

import { Divider, Stack } from "@mui/material";

export default async function LibraryPage() {
  const [{ data: ingredientGroups }, { data: mealTags }] = await Promise.all([
    fetchIngredientGroupsWithExamples(),
    fetchMealTagsWithExamples(),
  ]);

  return (
    <Stack spacing={4}>
      <PageHeader.Root
        title="Library"
        description="Manage ingredient groups, meal categories, and measurement types for your nutrition tracking."
      />
      <Divider />
      <IngredientGroupPageContent ingredientGroups={ingredientGroups} />
      <Divider />
      <MealTagPageContent mealTags={mealTags} />
    </Stack>
  );
}
