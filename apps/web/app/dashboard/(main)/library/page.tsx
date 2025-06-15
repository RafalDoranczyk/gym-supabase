import { PageHeader } from "@/components";
import {
  fetchIngredientGroupsWithExamples,
  IngredientGroupPageContent,
} from "@/modules/ingredient-group";
import { fetchMealTagsWithExamples, MealTagPageContent } from "@/modules/meal-tag";

import { Divider, Stack } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Library",
  description:
    "Organize your nutrition tracking with custom ingredient groups, meal categories, and tags.",
};

export default async function Library() {
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
