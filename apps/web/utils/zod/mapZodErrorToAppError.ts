import { AppError } from "@/core";
import { AppErrorCodes } from "@/core";
import type { ZodError } from "zod";

export function mapZodErrorToAppError(error: ZodError): AppError {
  const formattedErrors = error.errors.map((err) => {
    const path = err.path.length > 0 ? err.path.join(".") : "root";
    return `• ${path}: ${err.message}`;
  });

  const message =
    formattedErrors.length > 0
      ? `Validation failed:\n${formattedErrors.join("\n")}`
      : "Invalid data format";

  return new AppError(AppErrorCodes.VALIDATION_ERROR, message, error.flatten());
}
