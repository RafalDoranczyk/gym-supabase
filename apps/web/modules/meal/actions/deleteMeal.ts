"use server";

import { PATHS } from "@/constants";
import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  type DeleteMealPayload,
  DeleteMealPayloadSchema,
  type DeleteMealResponse,
  MealSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function deleteMeal(payload: DeleteMealPayload): Promise<DeleteMealResponse> {
  const validatedId = assertZodParse(DeleteMealPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  // Delete meal (cascade should handle related data, but we can be explicit)
  const { data, error } = await supabase
    .from("meals")
    .delete()
    .eq("id", validatedId.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error || !data) {
    throw mapSupabaseErrorToAppError(error);
  }
  revalidatePath(PATHS.LIBRARY.MEALS);
  return assertZodParse(MealSchema, data);
}
