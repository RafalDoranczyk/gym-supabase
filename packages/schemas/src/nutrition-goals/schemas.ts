import { z } from "zod";
import { CreatedAt, SupabaseId } from "../shared";
import { validationMessages } from "../shared/validationMessages";
import {
  ACTIVITY_LEVELS,
  FITNESS_PHASES,
  MAX_AGE,
  MAX_CALORIES,
  MAX_HEIGHT,
  MAX_MACROS,
  MAX_WEIGHT,
  MIN_AGE,
  MIN_CALORIES,
  MIN_HEIGHT,
  MIN_MACROS,
  MIN_WEIGHT,
} from "./constants";

// ========================================
// Core Schemas
// ========================================

export const FitnessPhaseSchema = z.enum(FITNESS_PHASES, {
  errorMap: () => ({ message: "Please select a valid fitness phase" }),
});

export const ActivityLevelSchema = z.enum(ACTIVITY_LEVELS, {
  errorMap: () => ({ message: "Please select a valid activity level" }),
});

// Main nutrition goals schema matching Supabase table structure
export const NutritionGoalsSchema = z.object({
  id: SupabaseId,
  user_id: SupabaseId,
  created_at: CreatedAt,
  updated_at: CreatedAt,

  // Phase info
  current_phase: FitnessPhaseSchema,
  current_phase_start_date: z.string().date(),
  activity_level: ActivityLevelSchema,

  // Daily targets (nullable in DB)
  daily_calorie_target: z
    .number()
    .int()
    .min(MIN_CALORIES, {
      message: validationMessages.number.min("Daily calories", MIN_CALORIES),
    })
    .max(MAX_CALORIES, {
      message: validationMessages.number.max("Daily calories", MAX_CALORIES),
    })
    .nullable(),

  daily_protein_target: z
    .number()
    .int()
    .min(MIN_MACROS, {
      message: validationMessages.number.min("Daily protein", MIN_MACROS),
    })
    .max(MAX_MACROS, {
      message: validationMessages.number.max("Daily protein", MAX_MACROS),
    })
    .nullable(),

  daily_carbs_target: z
    .number()
    .int()
    .min(MIN_MACROS, {
      message: validationMessages.number.min("Daily carbs", MIN_MACROS),
    })
    .max(MAX_MACROS, {
      message: validationMessages.number.max("Daily carbs", MAX_MACROS),
    })
    .nullable(),

  daily_fat_target: z
    .number()
    .int()
    .min(MIN_MACROS, {
      message: validationMessages.number.min("Daily fat", MIN_MACROS),
    })
    .max(MAX_MACROS, {
      message: validationMessages.number.max("Daily fat", MAX_MACROS),
    })
    .nullable(),

  // Weight goals (nullable in DB)
  target_weight: z
    .number()
    .min(MIN_WEIGHT, {
      message: validationMessages.number.min("Target weight", MIN_WEIGHT),
    })
    .max(MAX_WEIGHT, {
      message: validationMessages.number.max("Target weight", MAX_WEIGHT),
    })
    .nullable(),

  weekly_weight_change_target: z
    .number()
    .min(-2, {
      message: validationMessages.number.min("Weekly weight change", -2),
    })
    .max(1, {
      message: validationMessages.number.max("Weekly weight change", 1),
    })
    .nullable(),
});

// ========================================
// Form Schemas
// ========================================

// Extended form schema that includes both input fields and calculated targets
export const NutritionGoalsFormSchema = z.object({
  // Phase selection
  current_phase: FitnessPhaseSchema,
  activity_level: ActivityLevelSchema,

  // User stats for calculations (required for form)
  current_weight: z
    .number()
    .min(MIN_WEIGHT, {
      message: validationMessages.number.min("Current weight", MIN_WEIGHT),
    })
    .max(MAX_WEIGHT, {
      message: validationMessages.number.max("Current weight", MAX_WEIGHT),
    }),

  target_weight: z
    .number()
    .min(MIN_WEIGHT, {
      message: validationMessages.number.min("Target weight", MIN_WEIGHT),
    })
    .max(MAX_WEIGHT, {
      message: validationMessages.number.max("Target weight", MAX_WEIGHT),
    }),

  height: z
    .number()
    .int()
    .min(MIN_HEIGHT, {
      message: validationMessages.number.min("Height", MIN_HEIGHT),
    })
    .max(MAX_HEIGHT, {
      message: validationMessages.number.max("Height", MAX_HEIGHT),
    }),

  age: z
    .number()
    .int()
    .min(MIN_AGE, {
      message: validationMessages.number.min("Age", MIN_AGE),
    })
    .max(MAX_AGE, {
      message: validationMessages.number.max("Age", MAX_AGE),
    }),

  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select your gender" }),
  }),

  // Calculated targets (optional - filled by calculation functions)
  daily_calorie_target: z.number().int().min(MIN_CALORIES).max(MAX_CALORIES).optional(),

  daily_protein_target: z.number().int().min(MIN_MACROS).max(MAX_MACROS).optional(),

  daily_carbs_target: z.number().int().min(MIN_MACROS).max(MAX_MACROS).optional(),

  daily_fat_target: z.number().int().min(MIN_MACROS).max(MAX_MACROS).optional(),

  weekly_weight_change_target: z.number().min(-2).max(1).optional(),
});

// ========================================
// API Schemas
// ========================================

// For creating nutrition goals (maps to Supabase table)
export const CreateNutritionGoalsPayloadSchema = z.object({
  current_phase: FitnessPhaseSchema,
  current_phase_start_date: z
    .string()
    .date()
    .optional()
    .default(() => new Date().toISOString().split("T")[0]),
  activity_level: ActivityLevelSchema,
  target_weight: z.number().positive().optional(),
  daily_calorie_target: z.number().int().positive().optional(),
  daily_protein_target: z.number().int().positive().optional(),
  daily_carbs_target: z.number().int().positive().optional(),
  daily_fat_target: z.number().int().positive().optional(),
  weekly_weight_change_target: z.number().optional(),
});

export const UpdateNutritionGoalsPayloadSchema = CreateNutritionGoalsPayloadSchema.partial();

export const DeleteNutritionGoalsPayloadSchema = z.object({
  id: SupabaseId,
});

// ========================================
// Response Schemas
// ========================================

export const CreateNutritionGoalsResponseSchema = NutritionGoalsSchema;
export const UpdateNutritionGoalsResponseSchema = NutritionGoalsSchema;
export const FetchNutritionGoalsResponseSchema = NutritionGoalsSchema.nullable();

// ========================================
// Types
// ========================================

// Core types
export type FitnessPhase = z.infer<typeof FitnessPhaseSchema>;
export type ActivityLevel = z.infer<typeof ActivityLevelSchema>;
export type NutritionGoals = z.infer<typeof NutritionGoalsSchema>;

// Form types
export type NutritionGoalsForm = z.infer<typeof NutritionGoalsFormSchema>;

// API types
export type CreateNutritionGoalsPayload = z.infer<typeof CreateNutritionGoalsPayloadSchema>;
export type UpdateNutritionGoalsPayload = z.infer<typeof UpdateNutritionGoalsPayloadSchema>;
export type DeleteNutritionGoalsPayload = z.infer<typeof DeleteNutritionGoalsPayloadSchema>;

// Response types
export type CreateNutritionGoalsResponse = z.infer<typeof CreateNutritionGoalsResponseSchema>;
export type UpdateNutritionGoalsResponse = z.infer<typeof UpdateNutritionGoalsResponseSchema>;
export type FetchNutritionGoalsResponse = z.infer<typeof FetchNutritionGoalsResponseSchema>;
