import type { TableData, TableOrder } from "@/hooks";
import { assertZodParse } from "@/utils";
import {
  type IngredientSearchParams,
  IngredientSearchParamsSchema,
  type NutritionGroup,
} from "@repo/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useIngredientsFilters = (ingredientGroups: NutritionGroup[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters: IngredientSearchParams = assertZodParse(
    IngredientSearchParamsSchema,
    Object.fromEntries(searchParams.entries()),
  );

  const group = currentFilters.group ?? "All";

  const activeOptions = [{ id: -1, name: "All" }, ...ingredientGroups];

  const handleGroupChange = useCallback(
    (group: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("offset", "0");

      if (group === "All") params.delete("group");
      else params.set("group", group);

      router.push(`/dashboard/ingredients?${params}`);
    },
    [router, searchParams],
  );

  const handleSortChange = useCallback(
    (order: TableOrder, orderBy: keyof TableData) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("order", order);
      params.set("orderBy", orderBy.toString());
      router.push(`/dashboard/ingredients?${params}`);
    },
    [router, searchParams],
  );

  return {
    activeOptions,
    currentFilters: {
      ...currentFilters,
      group,
    },
    handleGroupChange,
    handleSortChange,
  };
};
