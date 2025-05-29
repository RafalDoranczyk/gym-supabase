import { mapSupabaseErrorToAppError } from "@/utils/supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function createFieldErrorHandler<T extends FieldValues>(
  fieldName: keyof T,
  options: {
    duplicateKeywords?: string[];
    duplicateMessage?: string;
    entityName?: string;
  } = {},
) {
  const {
    duplicateKeywords = ["already exists", "duplicate key", "unique constraint"],
    duplicateMessage = "This value already exists in the system",
    entityName,
  } = options;

  return (error: PostgrestError, setError: UseFormSetError<T>) => {
    const message = error?.message || "Unexpected error occurred";

    if (typeof message === "string") {
      const lowerMessage = message.toLowerCase();

      // Check if error is related to the specific entity (if provided)
      const isRelevantEntity = !entityName || lowerMessage.includes(entityName.toLowerCase());

      const isDuplicate =
        isRelevantEntity && duplicateKeywords.some((keyword) => lowerMessage.includes(keyword));

      if (isDuplicate) {
        setError(fieldName as Path<T>, {
          message: duplicateMessage,
          type: "duplicate",
        });
        return;
      }
    }

    throw mapSupabaseErrorToAppError(error);
  };
}
