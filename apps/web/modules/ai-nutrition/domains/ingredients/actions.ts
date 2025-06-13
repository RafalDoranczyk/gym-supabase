"use server";

import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/utils";
import type { UserIngredientForAI, UserIngredientsForAIResponse } from "./types";

/**
 * Fetch user's ingredients with group names for AI analysis
 * No pagination - AI needs to see all ingredients to make good suggestions
 */
export async function fetchUserIngredientsForAI(): Promise<UserIngredientsForAIResponse> {
  const { user, supabase } = await getUserScopedQuery();

  const { data: ingredientsData, error: ingredientsError } = await supabase
    .from("ingredients")
    .select(`
        id,
        name,
        calories,
        protein,
        carbs,
        fat,
        unit_type,
        ingredient_groups!inner(name)
      `)
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (ingredientsError) {
    throw mapSupabaseErrorToAppError(ingredientsError);
  }

  const { data: groupsData, error: groupsError } = await supabase
    .from("ingredient_groups")
    .select("name")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (groupsError) {
    throw mapSupabaseErrorToAppError(groupsError);
  }

  const ingredients: UserIngredientForAI[] = (ingredientsData || [])
    .map((item) => ({
      id: item.id,
      name: item.name,
      group_name: item.ingredient_groups[0]?.name || "Unknown",
      calories: item.calories || 0,
      protein: item.protein || 0,
      carbs: item.carbs || 0,
      fat: item.fat || 0,
      unit_type: item.unit_type,
    }))
    .sort((a, b) => {
      if (a.group_name !== b.group_name) {
        return a.group_name.localeCompare(b.group_name);
      }
      return a.name.localeCompare(b.name);
    });

  const groupsFromIngredients = Array.from(new Set(ingredients.map((ing) => ing.group_name)));
  const allGroups = Array.from(
    new Set([...groupsFromIngredients, ...(groupsData || []).map((g) => g.name)])
  );

  return {
    ingredients,
    count: ingredients.length,
    groups: allGroups,
  };
}
