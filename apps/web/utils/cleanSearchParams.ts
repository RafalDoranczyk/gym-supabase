/**
 * Removes undefined, null, and empty string values from an object.
 *
 * @template T - The object type extending Record<string, unknown>.
 * @param params - The object to clean.
 * @returns A new object with filtered properties.
 *
 * @example
 * ```typescript
 * const params = { name: "John", age: undefined, city: "", active: true };
 * const cleaned = cleanSearchParams(params);
 * // Result: { name: "John", active: true }
 * ```
 */
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
