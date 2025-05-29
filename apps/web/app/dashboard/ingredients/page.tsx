import { AppError, AppErrorCodes } from "@/core";
import {
  IngredientsPageOverview,
  fetchIngredientGroups,
  fetchIngredients,
} from "@/modules/ingredients";
import { cleanSearchParams } from "@/utils";
import { IngredientSearchParamsSchema } from "@repo/schemas";

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function IngredientsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cleanedParams = cleanSearchParams(params);

  const result = IngredientSearchParamsSchema.safeParse(cleanedParams);

  if (!result.success) {
    throw new AppError(AppErrorCodes.INVALID_QUERY_PARAMS);
  }

  const ingredientGroups = await fetchIngredientGroups();

  const { count, data } = await fetchIngredients(result.data, ingredientGroups);

  return (
    <IngredientsPageOverview ingredientGroups={ingredientGroups} ingredients={data} total={count} />
  );
}
