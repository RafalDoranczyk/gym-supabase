import type { TableData, TableOrder } from "@/hooks";

import { IngredientSearchParamsSchema, type NutritionGroup } from "@repo/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useIngredientsFilters = (ingredientGroups: NutritionGroup[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters = IngredientSearchParamsSchema.parse(
    Object.fromEntries(searchParams.entries()),
  );

  // Map empty group to "All" for display
  const displayGroup = currentFilters.group === "" ? "All" : currentFilters.group;

  const activeOptions = [
    { id: "", name: "All" },
    ...ingredientGroups.map((g) => ({ id: g.name, name: g.name })),
  ];

  const handleGroupChange = useCallback(
    (group: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("offset", "0");

      if (group === "All" || group === "") {
        params.delete("group");
      } else {
        params.set("group", group);
      }

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

  const handleClearFilters = useCallback(() => {
    router.push("/dashboard/ingredients");
  }, [router]);

  return {
    activeOptions,
    currentFilters: {
      ...currentFilters,
      group: displayGroup,
    },
    handleGroupChange,
    handleSortChange,
    handleClearFilters,
  };
};
