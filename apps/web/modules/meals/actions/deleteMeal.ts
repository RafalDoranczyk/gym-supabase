"use server";

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

  // First check if meal exists and belongs to user
  const { data: existingMeal, error: checkError } = await supabase
    .from("meals")
    .select("id, name")
    .eq("id", validatedId)
    .eq("user_id", user.id)
    .single();

  if (checkError || !existingMeal) {
    throw mapSupabaseErrorToAppError(checkError || new Error("Meal not found or unauthorized"));
  }

  // Delete meal (cascade should handle related data, but we can be explicit)
  const { data, error } = await supabase
    .from("meals")
    .delete()
    .eq("id", validatedId)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error || !data) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/meals");
  return assertZodParse(MealSchema, data);
}
