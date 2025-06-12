"use server";

import { PATHS } from "@/constants";
import { assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  type DeleteMealTagPayload,
  DeleteMealTagPayloadSchema,
  type DeleteMealTagResponse,
  MealTagSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function deleteMealTag(payload: DeleteMealTagPayload): Promise<DeleteMealTagResponse> {
  const validatedPayload = assertZodParse(DeleteMealTagPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("meal_tags")
    .delete()
    .eq("id", validatedPayload.id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath(PATHS.LIBRARY.ROOT);

  return assertZodParse(MealTagSchema, data);
}
