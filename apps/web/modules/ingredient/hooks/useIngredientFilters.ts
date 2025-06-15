import type { TableOrder } from "@/components";
import { PATHS } from "@/constants";
import type { IngredientGroup } from "@/modules/ingredient-group";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FetchIngredientsPayloadSchema } from "../schemas";

// Constants
const DEFAULT_GROUP = "All";
const PAGINATION_RESET = "0";

/**
 * Manages ingredients filtering and URL state synchronization
 */
export const useIngredientFilters = (ingredientGroups: IngredientGroup[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters = FetchIngredientsPayloadSchema.parse(
    Object.fromEntries(searchParams.entries())
  );

  // ✅ Helper function inside hook
  const createUpdatedParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Always reset pagination when filters change
      params.set("offset", PAGINATION_RESET);

      // Apply updates
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      return params;
    },
    [searchParams]
  );

  // Handle search changes
  const handleSearchChange = useCallback(
    (search: string) => {
      const params = createUpdatedParams({
        search: search.trim() || null,
      });
      router.push(`${PATHS.LIBRARY.INGREDIENTS}?${params}`);
    },
    [router, createUpdatedParams]
  );

  const handleGroupChange = useCallback(
    (group: string) => {
      const params = createUpdatedParams({
        group: group === DEFAULT_GROUP || group === "" ? null : group,
      });
      router.push(`${PATHS.LIBRARY.INGREDIENTS}?${params}`);
    },
    [router, createUpdatedParams]
  );

  const handleSortChange = useCallback(
    (order: TableOrder, orderBy: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("order", order);
      params.set("orderBy", orderBy.toString());
      router.push(`${PATHS.LIBRARY.INGREDIENTS}?${params}`);
    },
    [router, searchParams]
  );

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    const params = createUpdatedParams({
      search: null,
      group: null,
    });
    router.push(`${PATHS.LIBRARY.INGREDIENTS}?${params}`);
  }, [router, createUpdatedParams]);

  // Transform empty group to "All" for consistent UI display
  const displayGroup = !currentFilters.group ? DEFAULT_GROUP : currentFilters.group;

  const activeOptions = [
    { id: "", name: DEFAULT_GROUP },
    ...ingredientGroups.map((g) => ({ id: g.name, name: g.name })),
  ];

  const hasActiveFilters = !!currentFilters.search?.trim() || displayGroup !== DEFAULT_GROUP;

  return {
    activeOptions,
    currentFilters: {
      ...currentFilters,
      group: displayGroup,
    },
    handleSearchChange,
    handleGroupChange,
    handleSortChange,
    handleClearAllFilters,
    hasActiveFilters,
  };
};
