"use server";

import { assertZodParse, DB_TABLES, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  NutritionGroupSchema,
  type CreateNutritionGroupPayload,
  type CreateNutritionGroupResponse,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createIngredientGroup(
  payload: CreateNutritionGroupPayload,
): Promise<CreateNutritionGroupResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from(DB_TABLES.INGREDIENT_GROUPS)
    .insert([{ ...payload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/data-management");

  return assertZodParse(NutritionGroupSchema, data);
}
