"use server";

import { getUser } from "@/actions";
import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import {
  type CreateIngredientPayload,
  type CreateIngredientResponse,
  IngredientSchema,
} from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function createIngredient(
  payload: CreateIngredientPayload,
): Promise<CreateIngredientResponse> {
  const user = await getUser();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("ingredients")
    .insert([{ ...payload, user_id: user.id }])
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  revalidatePath("/dashboard/ingredients");

  return assertZodParse(IngredientSchema, data);
}
