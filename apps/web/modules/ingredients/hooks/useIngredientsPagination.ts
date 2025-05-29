import { usePagination } from "@/hooks";

import { INGREDIENTS_FETCH_LIMIT } from "../const";

export const useIngredientsPagination = () => {
  return usePagination({ limit: INGREDIENTS_FETCH_LIMIT });
};
