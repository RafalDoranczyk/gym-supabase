"use server";

import { PATHS } from "@/constants";
import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import { assertZodParse } from "@/utils";
import { revalidatePath } from "next/cache";
import {
  MealTagSchema,
  UpdateMealTagPayloadSchema,
  type UpdateMealTagPayload,
  type UpdateMealTagResponse,
} from "../schemas";

export async function updateMealTag(payload: UpdateMealTagPayload): Promise<UpdateMealTagResponse> {
  const validatedPayload = assertZodParse(UpdateMealTagPayloadSchema, payload);

  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("meal_tags")
    .update(validatedPayload)
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
