"use server";

import { getUser } from "@/actions";
import { assertZodParse, createServerClient, mapSupabaseErrorToAppError } from "@/utils";
import { MealSchema, type RemoveMealPayload, type RemoveMealResponse } from "@repo/schemas";
import { revalidatePath } from "next/cache";

export async function deleteMeal(id: RemoveMealPayload): Promise<RemoveMealResponse> {
  const user = await getUser();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("meals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  const meal = assertZodParse(MealSchema, data);

  revalidatePath("/dashboard/meals");

  return meal;
}
