import { fetchIngredients } from "@/modules/ingredients";
import { fetchMealTagsWithExamples } from "@/modules/meal-tags";
import { MealsPageContent, fetchMeals } from "@/modules/meals";
import { cleanSearchParams } from "@/utils";
import { FetchMealsPayloadSchema } from "@repo/schemas";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MealsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cleanedParams = cleanSearchParams(params);

  const validatedParams = FetchMealsPayloadSchema.parse(cleanedParams);

  const [{ data: mealTags }, { data: ingredients }, { data: meals, count: mealsCount }] =
    await Promise.all([
      fetchMealTagsWithExamples(),
      fetchIngredients(),
      fetchMeals(validatedParams),
    ]);

  return (
    <MealsPageContent
      ingredients={ingredients}
      meals={meals}
      mealTags={mealTags}
      total={mealsCount}
    />
  );
}
