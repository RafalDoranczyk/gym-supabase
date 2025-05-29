import type { ZodType } from "zod";

import { mapZodErrorToAppError } from "./mapZodErrorToAppError";

/**
 * Validates the provided data using the given Zod schema.
 *
 * @template T - The expected return type after parsing.
 * @param schema - The Zod schema to use for validation.
 * @param data - The unknown input data to validate and parse.
 * @returns The validated and parsed data as type T.
 * @throws AppError if validation fails (with code VALIDATION_ERROR).
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assertZodParse<T>(schema: ZodType<T, any>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw mapZodErrorToAppError(result.error);
  }

  return result.data;
}
