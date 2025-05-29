import type { TableData, TableOrder } from "@/hooks";
import { assertZodParse } from "@/utils";
import type { SelectChangeEvent } from "@mui/material";
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

  const { order = "desc", orderBy = "created_at", tag: tagParam = "" } = currentFilters;

  const selectedTagIds = useMemo(() => {
    return tagParam && tagParam !== "All" ? tagParam.split(",") : [];
  }, [tagParam]);

  const isAllSelected = selectedTagIds.length === 0;

  const activeOptions = useMemo(
    () => mealTags.map((tag) => ({ id: String(tag.id), name: tag.name })),
    [mealTags],
  );

  const handleTagChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const value = event.target.value;

      const selected = Array.isArray(value)
        ? value
        : typeof value === "string"
          ? value.split(",")
          : (value as string[]);

      const params = new URLSearchParams(searchParams.toString());
      params.set("offset", "0");

      // reset = "All"
      if (selected.includes("-1") || selected.length === 0) {
        params.delete("tag");
      } else {
        params.set("tag", selected.join(","));
      }

      if (order) params.set("order", order);
      if (orderBy) params.set("orderBy", orderBy);

      router.push(`/dashboard/meals?${params.toString()}`);
    },
    [router, searchParams, order, orderBy],
  );

  const handleSortChange = useCallback(
    (newOrder: TableOrder, newOrderBy: keyof TableData) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("order", newOrder);
      params.set("orderBy", newOrderBy.toString());

      if (tagParam && tagParam !== "All") {
        params.set("tag", tagParam);
      }

      router.push(`/dashboard/meals?${params.toString()}`);
    },
    [router, searchParams, tagParam],
  );

  return {
    activeOptions,
    currentFilters: {
      ...currentFilters,
      order,
      orderBy,
      tag: tagParam || "All",
    },
    handleSortChange,
    handleTagChange,
    isAllSelected,
    selectedTagIds,
  };
};
