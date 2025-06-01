import { usePagination } from "@/hooks";
import { MEALS_FETCH_LIMIT } from "@repo/schemas";

export const useMealsPagination = () => {
  return usePagination({ limit: MEALS_FETCH_LIMIT });
};
