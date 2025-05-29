import { AppError } from "@/core";
import { AppErrorCodes } from "@/core";
import type { ZodError } from "zod";

export function mapZodErrorToAppError(error: ZodError): AppError {
  return new AppError(
    AppErrorCodes.VALIDATION_ERROR,
    error.errors?.[0]?.message ?? "Invalid data format",
    error.flatten(),
  );
}
