import { usePagination } from "@/hooks";
import { MEALS_MAX_PAGE_SIZE } from "../constants/pagination";

export const useMealsPagination = () => {
  return usePagination({ limit: MEALS_MAX_PAGE_SIZE });
};
