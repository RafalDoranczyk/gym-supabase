"use server";

import { getUserScopedQuery, mapSupabaseErrorToAppError } from "@/core/supabase";
import type {
  CreateNutritionGoalsPayload,
  CreateNutritionGoalsResponse,
  FetchNutritionGoalsResponse,
  NutritionGoals,
  UpdateNutritionGoalsPayload,
  UpdateNutritionGoalsResponse,
} from "@repo/schemas";

// ========================================
// CREATE
// ========================================

export async function createNutritionGoals(
  payload: CreateNutritionGoalsPayload
): Promise<CreateNutritionGoalsResponse> {
  const { supabase, user } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("fitness_goals")
    .insert({
      user_id: user.id,
      ...payload,
    })
    .select()
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return data;
}

// ========================================
// READ
// ========================================

export async function getNutritionGoals(): Promise<FetchNutritionGoalsResponse> {
  const { supabase, user } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("fitness_goals")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Handle case where user has no nutrition goals yet
  if (error && error.code === "PGRST116") {
    return null; // No rows found - user hasn't set up nutrition goals yet
  }

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return data;
}

// Check if user has nutrition goals set up
export async function hasNutritionGoals(): Promise<boolean> {
  try {
    const goals = await getNutritionGoals();
    return goals !== null;
  } catch {
    return false;
  }
}

// ========================================
// UPDATE
// ========================================

export async function updateNutritionGoals(
  updates: UpdateNutritionGoalsPayload
): Promise<UpdateNutritionGoalsResponse> {
  const { supabase, user } = await getUserScopedQuery();

  const { data, error } = await supabase
    .from("fitness_goals")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }

  return data;
}

// ========================================
// DELETE
// ========================================

export async function deleteNutritionGoals(): Promise<void> {
  const { supabase, user } = await getUserScopedQuery();

  const { error } = await supabase.from("fitness_goals").delete().eq("user_id", user.id);

  if (error) {
    throw mapSupabaseErrorToAppError(error);
  }
}

// ========================================
// SPECIALIZED OPERATIONS
// ========================================

// Update just the current phase (for phase transitions)
export async function updateCurrentPhase(
  phase: NutritionGoals["current_phase"],
  calculatedTargets?: {
    daily_calorie_target: number;
    daily_protein_target: number;
    daily_carbs_target: number;
    daily_fat_target: number;
    weekly_weight_change_target: number;
  }
): Promise<UpdateNutritionGoalsResponse> {
  const updateData: UpdateNutritionGoalsPayload = {
    current_phase: phase,
    current_phase_start_date: new Date().toISOString().split("T")[0],
    ...calculatedTargets,
  };

  return updateNutritionGoals(updateData);
}

// Update activity level and recalculate targets
export async function updateActivityLevel(
  activityLevel: NutritionGoals["activity_level"],
  recalculatedTargets?: {
    daily_calorie_target: number;
    daily_protein_target: number;
    daily_carbs_target: number;
    daily_fat_target: number;
  }
): Promise<UpdateNutritionGoalsResponse> {
  const updateData: UpdateNutritionGoalsPayload = {
    activity_level: activityLevel,
    ...recalculatedTargets,
  };

  return updateNutritionGoals(updateData);
}

// Update target weight
export async function updateTargetWeight(
  targetWeight: number,
  recalculatedTargets?: {
    daily_calorie_target: number;
    daily_protein_target: number;
    daily_carbs_target: number;
    daily_fat_target: number;
    weekly_weight_change_target: number;
  }
): Promise<UpdateNutritionGoalsResponse> {
  const updateData: UpdateNutritionGoalsPayload = {
    target_weight: targetWeight,
    ...recalculatedTargets,
  };

  return updateNutritionGoals(updateData);
}

// Get current nutrition targets for dashboard/tracking
export async function getCurrentNutritionTargets(): Promise<{
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
} | null> {
  const goals = await getNutritionGoals();

  if (!goals) return null;

  return {
    calories: goals.daily_calorie_target,
    protein: goals.daily_protein_target,
    carbs: goals.daily_carbs_target,
    fat: goals.daily_fat_target,
  };
}

// Get phase info for dashboard
export async function getCurrentPhaseInfo(): Promise<{
  phase: NutritionGoals["current_phase"];
  startDate: string;
  daysSinceStart: number;
} | null> {
  const goals = await getNutritionGoals();

  if (!goals) return null;

  const startDate = new Date(goals.current_phase_start_date);
  const today = new Date();
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    phase: goals.current_phase,
    startDate: goals.current_phase_start_date,
    daysSinceStart,
  };
}
