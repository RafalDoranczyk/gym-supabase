import { fetchIngredientGroups } from "@/modules/ingredient-groups";
import { IngredientsPageContent, fetchIngredients } from "@/modules/ingredients";

import { cleanSearchParams } from "@/utils";
import { FetchIngredientsPayloadSchema } from "@repo/schemas";

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function IngredientsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cleanedParams = cleanSearchParams(params);

  const validatedParams = FetchIngredientsPayloadSchema.parse(cleanedParams);

  const [groupsResponse, ingredientsResponse] = await Promise.all([
    fetchIngredientGroups(),
    fetchIngredients(validatedParams),
  ]);

  return (
    <IngredientsPageContent
      ingredientGroups={groupsResponse.data}
      ingredients={ingredientsResponse.data}
      ingredientsCount={ingredientsResponse.count}
    />
  );
}
