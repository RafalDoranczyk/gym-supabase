import { IngredientsGroupPageView } from "@/modules/ingredient-groups";
import { fetchIngredientGroupsWithExamples } from "@/modules/ingredients";
import { fetchMealTagsWithExamples } from "@/modules/meal-tags";
import { MealTagsPageView } from "@/modules/meal-tags";
import { Divider, Stack } from "@mui/material";

export default async function DataManagement() {
  const [ingredientGroups, mealTags] = await Promise.all([
    fetchIngredientGroupsWithExamples(),
    fetchMealTagsWithExamples(),
  ]);

  return (
    <Stack spacing={4}>
      {/* Ingredient Groups Section */}
      <IngredientsGroupPageView groups={ingredientGroups.data} />

      <Divider />

      {/* Meal Tags Section */}
      <MealTagsPageView tags={mealTags.data} />
    </Stack>
  );
}
