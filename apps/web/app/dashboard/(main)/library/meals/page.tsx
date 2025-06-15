import { PageHeader } from "@/components";
import { fetchIngredients } from "@/modules/ingredient";
import { FetchMealsPayloadSchema, MealPageContent, fetchMeals } from "@/modules/meal";
import { fetchMealTagsWithExamples } from "@/modules/meal-tag";
import { cleanSearchParams } from "@/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meals",
  description:
    "Log daily meals, track nutrition intake, and analyze your eating patterns and habits.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Meals({ searchParams }: PageProps) {
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
    <>
      <PageHeader.Root
        title="Meals"
        description="Log your meals, monitor nutrition intake, and analyze your eating patterns over time."
      />
      <MealPageContent
        ingredients={ingredients}
        meals={meals}
        mealTags={mealTags}
        mealsCount={mealsCount}
      />
    </>
  );
}
