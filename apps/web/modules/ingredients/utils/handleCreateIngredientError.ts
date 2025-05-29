import { mapSupabaseErrorToAppError } from "@/utils/supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function handleCreateIngredientError<T extends FieldValues>(
  error: PostgrestError,
  setError: UseFormSetError<T>,
) {
  const message = error?.message || "Unexpected error occurred";

  if (
    typeof message === "string" &&
    message.toLowerCase().includes("ingredient") &&
    message.toLowerCase().includes("already exists")
  ) {
    setError("name" as Path<T>, {
      message,
      type: "manual",
    });
  } else {
    return mapSupabaseErrorToAppError(error);
  }
}
