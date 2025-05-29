import { AppError, AppErrorCodes } from "@/core";
import type { AuthApiError, AuthError, PostgrestError } from "@supabase/supabase-js";

type SupabaseKnownError = AuthApiError | AuthError | null | PostgrestError;

export function mapSupabaseErrorToAppError(error: SupabaseKnownError): AppError {
  if (!error) {
    return new AppError(AppErrorCodes.SERVER_ERROR, "Unknown Supabase error");
  }

  // Handle PostgREST errors (from `.from(...).insert(...)`)
  if ("code" in error && "message" in error && "details" in error) {
    switch (error.code) {
      case "22001":
        return new AppError(
          AppErrorCodes.VALIDATION_ERROR,
          "Data too long for column",
          error.details,
        );
      case "23503":
        return new AppError(
          AppErrorCodes.FOREIGN_KEY_VIOLATION,
          "Invalid foreign key reference",
          error.details,
        );
      case "23505":
        return new AppError(
          AppErrorCodes.INGREDIENT_NAME_EXISTS,
          "Ingredient with this name already exists",
          error.details,
        );
      case "42501":
        return new AppError(
          AppErrorCodes.PERMISSION_DENIED,
          "Insufficient privileges to perform this action",
          error.details,
        );
      default:
        return new AppError(AppErrorCodes.SERVER_ERROR, error.message, error.details);
    }
  }

  // Handle auth errors (from `.auth.signIn`, `.signOut`, etc.)
  if ("status" in error && "message" in error) {
    switch (error.status) {
      case 401:
        return new AppError(AppErrorCodes.UNAUTHORIZED, "You are not authorized.", error.message);
      case 403:
        return new AppError(AppErrorCodes.PERMISSION_DENIED, "Access denied.", error.message);
      case 404:
        return new AppError(AppErrorCodes.NOT_FOUND, "Resource not found.", error.message);
      case 409:
        return new AppError(AppErrorCodes.UNIQUE_VIOLATION, "Resource conflict.", error.message);
      case 422:
        return new AppError(
          AppErrorCodes.VALIDATION_ERROR,
          "Invalid data provided.",
          error.message,
        );
      default:
        return new AppError(AppErrorCodes.SERVER_ERROR, error.message);
    }
  }

  // Fallback
  return new AppError(AppErrorCodes.SERVER_ERROR, "Unhandled Supabase error");
}
