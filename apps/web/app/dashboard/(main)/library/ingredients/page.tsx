import { PageHeader } from "@/components";
import { IngredientPageContent, fetchIngredients } from "@/modules/ingredient";
import { fetchIngredientGroups } from "@/modules/ingredient-group";
import { cleanSearchParams } from "@/utils";
import { FetchIngredientsPayloadSchema } from "@repo/schemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ingredients",
  description: "Build and manage your personal ingredient library with nutrition facts and macros.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Ingredients({ searchParams }: PageProps) {
  const params = await searchParams;
  const cleanedParams = cleanSearchParams(params);

  const validatedParams = FetchIngredientsPayloadSchema.parse(cleanedParams);

  const [{ data: groupsResponse }, { data: ingredientsResponse, count }] = await Promise.all([
    fetchIngredientGroups(),
    fetchIngredients(validatedParams),
  ]);

  return (
    <>
      <PageHeader.Root title="Ingredients" description="Build and manage your nutrition database" />
      <IngredientPageContent
        ingredientGroups={groupsResponse}
        ingredients={ingredientsResponse}
        ingredientsCount={count}
      />
    </>
  );
}
