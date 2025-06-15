import type { ToastContextType } from "@/providers";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/**
 * Handles form submission errors with automatic field-specific error mapping
 * and fallback toast notifications.
 *
 * @template T - The form data type extending FieldValues.
 * @param error - The error object from form submission (can be any type).
 * @param setError - React Hook Form's setError function.
 * @param toast - Toast context for displaying general error messages.
 * @param uniqueFields - Mapping of field names to their unique constraint error messages.
 *
 * @example
 * ```typescript
 * .catch((error) => {
 *   handleFormErrors(error, setError, toast, {
 *     name: "This name already exists",
 *     email: "This email is already registered"
 *   });
 * });
 * ```
 */
export function handleFormErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  toast: ToastContextType,
  uniqueFields: Record<string, string> = {}
): void {
  // Safely extract error message from unknown error
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    }

    if (typeof err === "object" && err !== null) {
      // Handle objects with message property
      if ("message" in err && typeof err.message === "string") {
        return err.message;
      }

      // Handle objects with details property
      if ("details" in err && typeof err.details === "string") {
        return err.details;
      }

      // Try to stringify object
      try {
        return JSON.stringify(err);
      } catch {
        return "An error occurred";
      }
    }

    if (typeof err === "string") {
      return err;
    }

    return "An unknown error occurred";
  };

  const message = getErrorMessage(error).toLowerCase();

  // Check message for unique constraint violations
  if (
    message.includes("unique constraint violation") ||
    message.includes("unique constraint") ||
    message.includes("already exists") ||
    message.includes("duplicate")
  ) {
    // Try to match specific field mentioned in error message
    for (const [field, fieldMessage] of Object.entries(uniqueFields)) {
      if (message.includes(field.toLowerCase())) {
        setError(field as Path<T>, {
          message: fieldMessage,
          type: "unique",
        });
        return;
      }
    }

    // Fallback - if we have only one field in uniqueFields, it's probably the culprit
    const fields = Object.keys(uniqueFields);
    if (fields.length === 1) {
      const [field, fieldMessage] = Object.entries(uniqueFields)[0];
      setError(field as Path<T>, {
        message: fieldMessage,
        type: "unique",
      });
      return;
    }

    // Generic unique constraint error when no field mapping is available
    toast.error("This value already exists");
  } else {
    // All other errors are displayed as toast notifications
    const originalMessage = getErrorMessage(error);
    toast.error(originalMessage || "Something went wrong");
  }
}
