import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type UsePaginationProps = {
  limit: number;
};

/**
 * Pure pagination hook - only handles page/limit changes
 * Does NOT handle search, filters, or other concerns
 */
export function usePagination({ limit }: UsePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ Read current pagination state from URL
  const limitParam = Number(searchParams.get("limit")) || limit;
  const offsetParam = Number(searchParams.get("offset")) || 0;
  const currentPage = Math.floor(offsetParam / limitParam);

  const urlSearchParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  // ✅ Generic method to update any URL params while preserving others
  const onParamsChange = useCallback(
    (params: { param: string; value: number | string }[]) => {
      const newSearchParams = new URLSearchParams(urlSearchParams.toString());

      for (const { param, value } of params) {
        newSearchParams.set(param, value.toString());
      }

      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, urlSearchParams]
  );

  // ✅ Specific pagination handlers
  const onPageChange = useCallback(
    (page: number) => {
      onParamsChange([{ param: "offset", value: page * limitParam }]);
    },
    [limitParam, onParamsChange]
  );

  const onLimitChange = useCallback(
    (newLimit: number) => {
      onParamsChange([
        { param: "limit", value: newLimit },
        { param: "offset", value: 0 }, // Reset to first page when limit changes
      ]);
    },
    [onParamsChange]
  );

  // ✅ Reset pagination to first page (useful for other hooks)
  const resetPagination = useCallback(() => {
    onParamsChange([{ param: "offset", value: 0 }]);
  }, [onParamsChange]);

  return {
    // State
    limitParam,
    page: currentPage,

    // Actions
    onPageChange,
    onLimitChange,
    onParamsChange,
    resetPagination,

    // Utils
    searchParams: urlSearchParams,
  };
}
