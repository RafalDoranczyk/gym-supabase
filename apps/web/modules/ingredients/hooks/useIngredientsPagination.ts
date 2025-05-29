import { usePagination } from "@/hooks";
import { INGREDIENTS_FETCH_LIMIT } from "@repo/schemas";

export const useIngredientsPagination = () => {
  return usePagination({ limit: INGREDIENTS_FETCH_LIMIT });
};
