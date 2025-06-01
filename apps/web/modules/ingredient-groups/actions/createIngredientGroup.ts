"use server";

import { DB_TABLES, assertZodParse, getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import {
  type CreateNutritionGroupPayload,
  type CreateNutritionGroupResponse,
  NutritionGroupSchema,
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
