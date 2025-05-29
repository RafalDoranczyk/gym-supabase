import { usePagination } from "@/hooks";

import { MEALS_FETCH_LIMIT } from "../const";

export const useMealsPagination = () => {
  return usePagination({ limit: MEALS_FETCH_LIMIT });
};
