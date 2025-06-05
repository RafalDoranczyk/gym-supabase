import type { TableData, TableOrder } from "@/hooks";
import { FetchIngredientsPayloadSchema, type IngredientGroup } from "@repo/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Manages ingredients filtering and URL state synchronization
 */
export const useIngredientsFilters = (ingredientGroups: IngredientGroup[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters = FetchIngredientsPayloadSchema.parse(
    Object.fromEntries(searchParams.entries())
  );

  const handleGroupChange = useCallback(
    (group: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset pagination when filters change
      params.set("offset", "0");

      if (group === "All" || group === "") {
        params.delete("group");
      } else {
        params.set("group", group);
      }

      router.push(`/dashboard/ingredients?${params}`);
    },
    [router, searchParams]
  );

  const handleSortChange = useCallback(
    (order: TableOrder, orderBy: keyof TableData) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("order", order);
      params.set("orderBy", orderBy.toString());
      router.push(`/dashboard/ingredients?${params}`);
    },
    [router, searchParams]
  );

  // Transform empty group to "All" for consistent UI display
  const displayGroup = !currentFilters.group ? "All" : currentFilters.group;

  const activeOptions = [
    { id: "", name: "All" },
    ...ingredientGroups.map((g) => ({ id: g.name, name: g.name })),
  ];

  const hasActiveFilters = !!currentFilters.search?.trim() || displayGroup !== "All";

  return {
    activeOptions,
    currentFilters: {
      ...currentFilters,
      group: displayGroup,
    },
    handleGroupChange,
    handleSortChange,
    hasActiveFilters,
  };
};
