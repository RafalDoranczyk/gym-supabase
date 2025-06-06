import { PageHeader } from "@/components";
import { fetchIngredientGroups } from "@/modules/ingredient-groups";
import { IngredientsPageContent, fetchIngredients } from "@/modules/ingredients";
import { cleanSearchParams } from "@/utils";
import { FetchIngredientsPayloadSchema } from "@repo/schemas";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function IngredientsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cleanedParams = cleanSearchParams(params);

  const validatedParams = FetchIngredientsPayloadSchema.parse(cleanedParams);

  const [{ data: groupsResponse }, { data: ingredientsResponse, count }] = await Promise.all([
    fetchIngredientGroups(),
    fetchIngredients(validatedParams),
  ]);

  return (
    <div>
      <PageHeader title="Ingredients" description="Build and manage your nutrition database" />
      <IngredientsPageContent
        ingredientGroups={groupsResponse}
        ingredients={ingredientsResponse}
        ingredientsCount={count}
      />
    </div>
  );
}
