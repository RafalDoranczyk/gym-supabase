"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  type DeleteMealPayload,
  DeleteMealPayloadSchema,
  type DeleteMealResponse,
  MealSchema,
} from "../schemas";

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
