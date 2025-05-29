import { createFieldErrorHandler } from "@/utils/supabase";
import type { CreateMealPayload } from "@repo/schemas";

export const handleCreateMealError = createFieldErrorHandler<CreateMealPayload>("name", {
  entityName: "meal",
  duplicateMessage: "A meal with this name already exists",
});
