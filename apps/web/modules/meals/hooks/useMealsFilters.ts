import type { TableData, TableOrder } from "@/hooks";
import { assertZodParse } from "@/utils";
import { type MealSearchParams, MealSearchParamsSchema, type MealTag } from "@repo/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export const useMealsFilters = (mealTags: MealTag[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilters: MealSearchParams = assertZodParse(
    MealSearchParamsSchema,
    Object.fromEntries(searchParams.entries()),
  );

  const {
    order = "desc",
    orderBy = "created_at",
    tag: tagParam = "",
    search = "",
    limit = 20,
    offset = 0,
  } = currentFilters;

  const selectedTagIds = useMemo(() => {
    // If no tag param or empty, default to all tags selected
    if (!tagParam || tagParam === "") {
      return mealTags.map((tag) => String(tag.id));
    }
    return tagParam.split(",");
  }, [tagParam, mealTags]);

  const isAllSelected = selectedTagIds.length === mealTags.length;

  const activeOptions = useMemo(
    () => mealTags.map((tag) => ({ id: String(tag.id), name: tag.name })),
    [mealTags],
  );

  const handleTagChange = useCallback(
    (selectedIds: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("offset", "0"); // Reset pagination when filtering

      if (selectedIds.length > 0) {
        params.set("tag", selectedIds.join(","));
      } else {
        params.delete("tag");
      }

      router.push(`/dashboard/meals?${params}`);
    },
    [router, searchParams],
  );

  const handleSortChange = useCallback(
    (newOrder: TableOrder, newOrderBy: keyof TableData) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("order", newOrder);
      params.set("orderBy", newOrderBy.toString());
      router.push(`/dashboard/meals?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleClearFilters = useCallback(() => {
    router.push("/dashboard/meals");
  }, [router]);

  return {
    activeOptions,
    currentFilters: {
      order,
      orderBy,
      tag: tagParam,
      search,
      limit,
      offset,
    },
    handleSortChange,
    handleTagChange,
    handleClearFilters,
    isAllSelected,
    selectedTagIds,
  };
};
