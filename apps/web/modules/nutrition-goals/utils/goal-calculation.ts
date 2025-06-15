import type { ActivityLevel, FitnessPhase } from "../schemas";

// ========================================
// TYPES
// ========================================

export type UserPhysicalStats = {
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: "male" | "female";
};

export type NutritionTargets = {
  daily_calorie_target: number;
  daily_protein_target: number;
  daily_carbs_target: number;
  daily_fat_target: number;
  weekly_weight_change_target: number;
};

export type ActivityMultiplier = {
  sedentary: 1.2;
  lightly_active: 1.375;
  moderately_active: 1.55;
  very_active: 1.725;
  extra_active: 1.9;
};

// ========================================
// CONSTANTS
// ========================================

// Activity level multipliers for TDEE calculation
export const ACTIVITY_MULTIPLIERS: ActivityMultiplier = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

// Activity multipliers for carbohydrate needs
export const CARB_ACTIVITY_MULTIPLIERS = {
  sedentary: 0.8, // Less carbs for low activity
  lightly_active: 1.0, // Base carbs
  moderately_active: 1.2, // More carbs for moderate training
  very_active: 1.5, // High carbs for intense training
  extra_active: 1.7, // Maximum carbs for very high activity
} as const;

// Calories per gram for macronutrients
export const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

// Phase-specific calorie adjustments
export const PHASE_CALORIE_ADJUSTMENTS = {
  cutting: -400, // 400 calorie deficit
  bulking: 300, // 300 calorie surplus
  maintenance: 0, // No adjustment
  recomp: -100, // Small deficit for body recomposition
} as const;

// ========================================
// CORE CALCULATIONS
// ========================================

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
 * Most accurate formula for BMR calculation
 */
export function calculateBMR(stats: UserPhysicalStats): number {
  const { weight, height, age, gender } = stats;

  // Base calculation: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(years)
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;

  // Gender adjustment
  const bmr = gender === "male" ? baseBMR + 5 : baseBMR - 161;

  return Math.round(bmr);
}

/**
 * Get activity multiplier for TDEE calculation
 */
export function getActivityMultiplier(activityLevel: ActivityLevel): number {
  return ACTIVITY_MULTIPLIERS[activityLevel];
}

/**
 * Calculate Total Daily Energy Expenditure
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = getActivityMultiplier(activityLevel);
  return Math.round(bmr * multiplier);
}

/**
 * Calculate phase-adjusted calories based on TDEE and fitness phase
 */
export function calculatePhaseCalories(tdee: number, phase: FitnessPhase): number {
  const adjustment = PHASE_CALORIE_ADJUSTMENTS[phase];
  return Math.max(1200, tdee + adjustment); // Minimum 1200 calories for safety
}

// ========================================
// MACRO CALCULATIONS
// ========================================

/**
 * Calculate protein target based on weight and phase
 */
export function calculateProteinTarget(weight: number, phase: FitnessPhase): number {
  const proteinPerKg = {
    cutting: 2.2, // Higher protein for muscle preservation during deficit
    bulking: 1.8, // Adequate protein for muscle building
    maintenance: 1.6, // Standard protein intake
    recomp: 2.0, // Higher protein for body recomposition
  };

  return Math.round(weight * proteinPerKg[phase]);
}

/**
 * Calculate carb target based on weight, phase, AND activity level
 * UPDATED: Now considers activity level for energy needs
 */
export function calculateCarbTarget(
  weight: number,
  phase: FitnessPhase,
  activityLevel: ActivityLevel
): number {
  // Base carbs per kg based on phase
  const baseCarbsPerKg = {
    cutting: 1.0, // Lower base for fat loss
    bulking: 3.5, // High base for muscle building
    maintenance: 2.5, // Moderate base for maintenance
    recomp: 2.0, // Moderate base for recomposition
  };

  // Get activity multiplier for carbs
  const activityMultiplier = CARB_ACTIVITY_MULTIPLIERS[activityLevel];

  // Calculate activity-adjusted carbs
  const baseCarbs = weight * baseCarbsPerKg[phase];
  const adjustedCarbs = baseCarbs * activityMultiplier;

  return Math.round(adjustedCarbs);
}

/**
 * Calculate fat target based on total calories and other macros
 */
export function calculateFatTarget(
  totalCalories: number,
  proteinGrams: number,
  carbGrams: number
): number {
  // Calculate calories from protein and carbs
  const proteinCalories = proteinGrams * CALORIES_PER_GRAM.protein;
  const carbCalories = carbGrams * CALORIES_PER_GRAM.carbs;

  // Remaining calories should come from fat
  const fatCalories = totalCalories - proteinCalories - carbCalories;

  // Convert fat calories to grams
  const fatGrams = fatCalories / CALORIES_PER_GRAM.fat;

  // Ensure minimum fat intake (at least 15% of total calories)
  const minFatCalories = totalCalories * 0.15;
  const minFatGrams = minFatCalories / CALORIES_PER_GRAM.fat;

  // Ensure maximum fat intake (no more than 40% of total calories for very active people)
  const maxFatCalories = totalCalories * 0.4;
  const maxFatGrams = maxFatCalories / CALORIES_PER_GRAM.fat;

  return Math.round(Math.max(minFatGrams, Math.min(fatGrams, maxFatGrams)));
}

/**
 * Calculate weekly weight change target based on phase
 */
export function calculateWeeklyWeightChangeTarget(phase: FitnessPhase): number {
  const targets = {
    cutting: -0.5, // Lose 0.5kg per week
    bulking: 0.3, // Gain 0.3kg per week (slow bulk)
    maintenance: 0, // Maintain weight
    recomp: -0.1, // Very slow weight loss
  };

  return targets[phase];
}

// ========================================
// MAIN CALCULATION FUNCTION
// ========================================

/**
 * Calculate complete nutrition targets based on user stats and phase
 * UPDATED: Now passes activity level to carb calculation
 */
export function calculatePhaseTargets(
  userStats: UserPhysicalStats,
  activityLevel: ActivityLevel,
  phase: FitnessPhase
): NutritionTargets {
  // Step 1: Calculate BMR
  const bmr = calculateBMR(userStats);

  // Step 2: Calculate TDEE
  const tdee = calculateTDEE(bmr, activityLevel);

  // Step 3: Adjust calories for phase
  const phaseCalories = calculatePhaseCalories(tdee, phase);

  // Step 4: Calculate macros (NOW includes activity level for carbs)
  const protein = calculateProteinTarget(userStats.weight, phase);
  const carbs = calculateCarbTarget(userStats.weight, phase, activityLevel); // ← UPDATED
  const fat = calculateFatTarget(phaseCalories, protein, carbs);

  // Step 5: Calculate weekly weight change target
  const weeklyWeightChange = calculateWeeklyWeightChangeTarget(phase);

  return {
    daily_calorie_target: phaseCalories,
    daily_protein_target: protein,
    daily_carbs_target: carbs,
    daily_fat_target: fat,
    weekly_weight_change_target: weeklyWeightChange,
  };
}

// ========================================
// VALIDATION & HELPERS
// ========================================

/**
 * Validate if calculated targets make nutritional sense
 * UPDATED: More flexible fat percentage for active individuals
 */
export function validateNutritionTargets(targets: NutritionTargets): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Check minimum calories
  if (targets.daily_calorie_target < 1200) {
    warnings.push("Daily calories are below recommended minimum (1200)");
  }

  // Check protein percentage (should be 15-35% of total calories)
  const proteinCalories = targets.daily_protein_target * CALORIES_PER_GRAM.protein;
  const proteinPercentage = (proteinCalories / targets.daily_calorie_target) * 100;

  if (proteinPercentage < 15) {
    warnings.push("Protein intake is below recommended minimum (15% of calories)");
  }
  if (proteinPercentage > 35) {
    warnings.push("Protein intake is above recommended maximum (35% of calories)");
  }

  // Check fat percentage (should be 15-40% of total calories - more flexible for active people)
  const fatCalories = targets.daily_fat_target * CALORIES_PER_GRAM.fat;
  const fatPercentage = (fatCalories / targets.daily_calorie_target) * 100;

  if (fatPercentage < 15) {
    warnings.push("Fat intake is below recommended minimum (15% of calories)");
  }
  if (fatPercentage > 40) {
    warnings.push("Fat intake is above recommended maximum (40% of calories)");
  }

  // Check carb percentage (should be at least 30% for active individuals)
  const carbCalories = targets.daily_carbs_target * CALORIES_PER_GRAM.carbs;
  const carbPercentage = (carbCalories / targets.daily_calorie_target) * 100;

  if (carbPercentage < 20) {
    warnings.push("Carbohydrate intake might be too low for optimal performance");
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}

/**
 * Get macro breakdown as percentages
 */
export function getMacroPercentages(targets: NutritionTargets): {
  protein: number;
  carbs: number;
  fat: number;
} {
  const totalCalories = targets.daily_calorie_target;
  const proteinCalories = targets.daily_protein_target * CALORIES_PER_GRAM.protein;
  const carbCalories = targets.daily_carbs_target * CALORIES_PER_GRAM.carbs;
  const fatCalories = targets.daily_fat_target * CALORIES_PER_GRAM.fat;

  return {
    protein: Math.round((proteinCalories / totalCalories) * 100),
    carbs: Math.round((carbCalories / totalCalories) * 100),
    fat: Math.round((fatCalories / totalCalories) * 100),
  };
}

/**
 * Recalculate targets when user stats change
 */
export function recalculateTargetsForNewStats(
  currentGoals: { current_phase: FitnessPhase; activity_level: ActivityLevel },
  newUserStats: UserPhysicalStats
): NutritionTargets {
  return calculatePhaseTargets(
    newUserStats,
    currentGoals.activity_level,
    currentGoals.current_phase
  );
}
