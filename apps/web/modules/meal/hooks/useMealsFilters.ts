import type { TableOrder } from "@/components";
import { PATHS } from "@/constants";
import { FetchMealsPayloadSchema, type MealTag } from "@repo/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

// Constants
const PAGINATION_RESET = "0";

/**
 * Manages meals filtering and URL state synchronization
 */
export const useMealsFilters = (mealTags: MealTag[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters = FetchMealsPayloadSchema.parse(Object.fromEntries(searchParams.entries()));

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
      router.push(`${PATHS.LIBRARY.MEALS}?${params}`);
    },
    [router, createUpdatedParams]
  );

  const selectedTagIds = useMemo(() => {
    // If no tag param or empty, default to all tags selected
    if (!currentFilters.tag || currentFilters.tag === "") {
      return mealTags.map((tag) => String(tag.id));
    }
    return currentFilters.tag.split(",");
  }, [currentFilters.tag, mealTags]);

  const handleTagChange = useCallback(
    (selectedIds: string[]) => {
      const params = createUpdatedParams({
        tag:
          selectedIds.length > 0 && selectedIds.length < mealTags.length
            ? selectedIds.join(",")
            : null,
      });
      router.push(`${PATHS.LIBRARY.MEALS}?${params}`);
    },
    [router, createUpdatedParams, mealTags.length]
  );

  const handleSortChange = useCallback(
    (order: TableOrder, orderBy: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("order", order);
      params.set("orderBy", orderBy.toString());
      router.push(`${PATHS.LIBRARY.MEALS}?${params}`);
    },
    [router, searchParams]
  );

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    const params = createUpdatedParams({
      search: null,
      tag: null,
    });
    router.push(`${PATHS.LIBRARY.MEALS}?${params}`);
  }, [router, createUpdatedParams]);

  const activeOptions = useMemo(
    () => mealTags.map((tag) => ({ id: String(tag.id), name: tag.name })),
    [mealTags]
  );

  const hasActiveFilters =
    !!currentFilters.search?.trim() ||
    (selectedTagIds.length > 0 && selectedTagIds.length < mealTags.length);

  return {
    activeOptions,
    currentFilters,
    selectedTagIds,
    handleSearchChange,
    handleTagChange,
    handleSortChange,
    handleClearAllFilters,
    hasActiveFilters,
  };
};
