import { createFieldErrorHandler } from "@/utils/supabase";
import type { Ingredient } from "@repo/schemas";

export const handleCreateIngredientError = createFieldErrorHandler<Ingredient>("name", {
  entityName: "ingredient",
  duplicateMessage: "An ingredient with this name already exists",
});
