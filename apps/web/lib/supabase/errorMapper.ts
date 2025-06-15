export function createSupabaseErrorMapper<TAppError>(
  errorFactory: (code: string, message: string, details?: string) => TAppError
) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return function mapError(error: any): TAppError {
    if (!error) {
      return errorFactory("SERVER_ERROR", "Unknown Supabase error");
    }

    // Handle PostgREST errors
    if ("code" in error && "message" in error && "details" in error) {
      switch (error.code) {
        case "22001":
          return errorFactory("VALIDATION_ERROR", "Data too long for column", error.details);
        case "23503":
          return errorFactory(
            "FOREIGN_KEY_VIOLATION",
            "Invalid foreign key reference",
            error.details
          );
        case "23505":
          return errorFactory("UNIQUE_VIOLATION", "Unique constraint violation", error.details);
        case "42501":
          return errorFactory("PERMISSION_DENIED", "Insufficient privileges", error.details);
        default:
          return errorFactory("SERVER_ERROR", error.message, error.details);
      }
    }

    // Handle auth errors
    if ("status" in error && "message" in error) {
      switch (error.status) {
        case 401:
          return errorFactory("UNAUTHORIZED", "You are not authorized", error.message);
        case 403:
          return errorFactory("PERMISSION_DENIED", "Access denied", error.message);
        case 404:
          return errorFactory("NOT_FOUND", "Resource not found", error.message);
        case 409:
          return errorFactory("UNIQUE_VIOLATION", "Resource conflict", error.message);
        case 422:
          return errorFactory("VALIDATION_ERROR", "Invalid data provided", error.message);
        default:
          return errorFactory("SERVER_ERROR", error.message);
      }
    }

    return errorFactory("SERVER_ERROR", "Unhandled Supabase error");
  };
}
