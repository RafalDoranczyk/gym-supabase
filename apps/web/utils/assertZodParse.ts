import { AppError, AppErrorCodes } from "@/core";
import type { ZodError, ZodType } from "zod";

function mapZodErrorToAppError(error: ZodError): AppError {
  const formattedErrors = error.errors.map((err) => {
    const path = err.path.length > 0 ? err.path.join(".") : "root";

    // Enhanced error message with more details from the original error
    let message = `• ${path}: ${err.message}`;

    // Add received value info if available
    if ("received" in err && err.received !== undefined) {
      message += ` (received: ${JSON.stringify(err.received)})`;
    }

    // Add expected type info if available
    if ("expected" in err && err.expected !== undefined) {
      message += ` (expected: ${err.expected})`;
    }

    // Add error code for additional context
    if (err.code) {
      message += ` [${err.code}]`;
    }

    return message;
  });

  const message =
    formattedErrors.length > 0
      ? `Validation failed:\n${formattedErrors.join("\n")}`
      : "Invalid data format";

  return new AppError(AppErrorCodes.VALIDATION_ERROR, message, error.flatten());
}

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
    // Log detailed error information for debugging purposes
    console.error("Zod validation failed:", {
      inputData: data,
      errors: result.error.errors,
      formatted: result.error.format(),
      flattened: result.error.flatten(),
    });

    throw mapZodErrorToAppError(result.error);
  }

  return result.data;
}
