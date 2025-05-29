import { AppError, AppErrorCodes } from "@/core";
import { fetchIngredients } from "@/modules/ingredients";
import { MealsPageOverview, fetchMealTags, fetchMeals } from "@/modules/meals";
import { cleanSearchParams } from "@/utils";
import { MealSearchParamsSchema } from "@repo/schemas";

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function MealsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cleanedParams = cleanSearchParams(params);

  const result = MealSearchParamsSchema.safeParse(cleanedParams);

  if (!result.success) {
    throw new AppError(AppErrorCodes.INVALID_QUERY_PARAMS);
  }

  const mealTags = await fetchMealTags();
  const { data: ingredients } = await fetchIngredients();
  const { count, data } = await fetchMeals(result.data);

  return (
    <MealsPageOverview ingredients={ingredients} meals={data} mealTags={mealTags} total={count} />
  );
}
