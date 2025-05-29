import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type UsePaginationProps = {
  limit: number;
};

export function usePagination({ limit }: UsePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const limitParam = Number(searchParams.get("limit")) || limit;
  const offsetParam = Number(searchParams.get("offset")) || 0;

  const urlSearchParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const onParamsChange = useCallback(
    (params: { param: string; value: number | string }[]) => {
      const newSearchParams = new URLSearchParams(urlSearchParams.toString());

      for (const { param, value } of params) {
        newSearchParams.set(param, value.toString());
      }

      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, urlSearchParams],
  );

  const onSearchChange = useCallback(
    (search: string) => {
      urlSearchParams.set("offset", "0");
      urlSearchParams.set("search", search);
      router.push(`${pathname}?${urlSearchParams}`);
    },
    [pathname, router, urlSearchParams],
  );

  const onPageChange = useCallback(
    (page: number) => {
      onParamsChange([{ param: "offset", value: page * limitParam }]);
    },
    [limitParam, onParamsChange],
  );

  return {
    limitParam,
    onPageChange,
    onParamsChange,
    onSearchChange,
    page: Math.floor(offsetParam / limitParam),
    searchParams: urlSearchParams,
  };
}
