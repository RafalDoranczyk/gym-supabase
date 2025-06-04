import { fetchIngredients } from "@/modules/ingredients";
import { fetchMealTagsWithExamples } from "@/modules/meal-tags";
import { MealsPageContent, fetchMeals } from "@/modules/meals";
import { cleanSearchParams } from "@/utils";
import { MealSearchParamsSchema } from "@repo/schemas";

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function MealsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cleanedParams = cleanSearchParams(params);

  const validatedParams = MealSearchParamsSchema.parse(cleanedParams);

  const [mealTags, ingredients, meals] = await Promise.all([
    fetchMealTagsWithExamples(),
    fetchIngredients(),
    fetchMeals(validatedParams),
  ]);

  return (
    <MealsPageContent
      ingredients={ingredients.data}
      meals={meals.data}
      mealTags={mealTags.data}
      total={meals.count}
    />
  );
}
