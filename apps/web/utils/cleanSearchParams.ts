export function cleanSearchParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) => {
      return (
        value !== undefined && // Filter out undefined values
        value !== null && // Filter out null values
        !(typeof value === "string" && value.trim() === "") // Filter out empty strings
      );
    }),
  ) as Partial<T>;
}
