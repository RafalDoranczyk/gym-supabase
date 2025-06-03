import { usePagination } from "@/hooks";

import { INGREDIENTS_DEFAULT_PAGE_SIZE } from "../constants";

export const useIngredientsPagination = () => {
  return usePagination({ limit: INGREDIENTS_DEFAULT_PAGE_SIZE });
};
