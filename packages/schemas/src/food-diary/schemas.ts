import { z } from "zod";

import { IngredientSchema } from "../ingredient";
import { CreatedAt, SupabaseId } from "../shared";
import { validationMessages } from "../shared/validationMessages";
import { FOOD_DIARY_MEAL_NAME_MAX_LENGTH, FOOD_DIARY_MEAL_NAME_MIN_LENGTH } from "./constants";

// ========================================
// Helper Schemas
// ========================================

// Minimal Ingredient shape used inside FoodDiaryIngredient (picked from full schema)
const MinimalIngredientSchema = IngredientSchema.pick({
  calories: true,
  carbs: true,
  fat: true,
  id: true,
  name: true,
  protein: true,
  unit_type: true,
});

// Ingredient used in food diary with nutritional data
export const FoodDiaryIngredientSchema = z.object({
  id: SupabaseId,
  diary_meal_id: SupabaseId,
  ingredient_id: SupabaseId,
  quantity: z.number().positive({
    message: validationMessages.number.positive("Quantity"),
  }),
  total_calories: z.number().min(0, {
    message: validationMessages.number.min("Total calories", 0),
  }),
  total_protein: z
    .number()
    .min(0, {
      message: validationMessages.number.min("Total protein", 0),
    })
    .optional(),
  total_carbs: z
    .number()
    .min(0, {
      message: validationMessages.number.min("Total carbs", 0),
    })
    .optional(),
  total_fat: z
    .number()
    .min(0, {
      message: validationMessages.number.min("Total fat", 0),
    })
    .optional(),
  created_at: CreatedAt,
  updated_at: CreatedAt,
  ingredient: MinimalIngredientSchema,
});

// Daily nutrition summary
export const DailyNutritionSummarySchema = z.object({
  user_id: SupabaseId,
  entry_date: z.string().date(),
  total_meals: z.number().min(0),
  total_ingredients: z.number().min(0),
  daily_calories: z.number().min(0),
  daily_protein: z.number().min(0),
  daily_carbs: z.number().min(0),
  daily_fat: z.number().min(0),
});

// Meal nutrition summary (from view)
export const MealNutritionSummarySchema = z.object({
  meal_id: SupabaseId,
  user_id: SupabaseId,
  entry_date: z.string().date(),
  meal_name: z.string(),
  meal_order: z.number(),
  ingredient_count: z.number().min(0),
  meal_calories: z.number().min(0),
  meal_protein: z.number().min(0),
  meal_carbs: z.number().min(0),
  meal_fat: z.number().min(0),
  created_at: CreatedAt,
});

// ========================================
// Types & Schemas
// ========================================

export const FoodDiaryMealFormSchema = z.object({
  entry_date: z.string().date(validationMessages.string.required("Entry date")),
  meal_name: z
    .string()
    .min(FOOD_DIARY_MEAL_NAME_MIN_LENGTH, {
      message: validationMessages.string.min("Meal name", FOOD_DIARY_MEAL_NAME_MIN_LENGTH),
    })
    .max(FOOD_DIARY_MEAL_NAME_MAX_LENGTH, {
      message: validationMessages.string.max("Meal name", FOOD_DIARY_MEAL_NAME_MAX_LENGTH),
    })
    .transform((val) => val.trim()),
  meal_order: z
    .number()
    .min(1, {
      message: validationMessages.number.min("Meal order", 1),
    })
    .optional(),
  ingredients: z
    .array(
      z.object({
        ingredient_id: SupabaseId,
        quantity: z.number().positive({
          message: validationMessages.number.positive("Quantity"),
        }),
        total_calories: z.number().min(0),
        total_protein: z.number().min(0).optional(),
        total_carbs: z.number().min(0).optional(),
        total_fat: z.number().min(0).optional(),
      })
    )
    .optional(),
});

export const FoodDiaryMealSchema = z.object({
  id: SupabaseId,
  user_id: SupabaseId,
  entry_date: z.string().date(),
  meal_name: z.string(),
  meal_order: z.number(),
  created_at: CreatedAt,
  updated_at: CreatedAt,
  food_diary_ingredients: z.array(FoodDiaryIngredientSchema).optional(),
});

// Extended schema for detailed view with populated relations
export const DetailedFoodDiaryMealSchema = FoodDiaryMealSchema.extend({
  food_diary_ingredients: z.array(FoodDiaryIngredientSchema), // Required for detailed view
});

// Combined meal schema (result of combine function)
export const CombinedMealSchema = z.object({
  id: SupabaseId,
  user_id: SupabaseId,
  entry_date: z.string().date(),
  meal_name: z.string(),
  meal_order: z.number(),
  created_at: CreatedAt,
  // Pre-calculated totals from view
  total_calories: z.number().min(0),
  total_protein: z.number().min(0),
  total_carbs: z.number().min(0),
  total_fat: z.number().min(0),
  ingredient_count: z.number().min(0),
  // Detailed ingredients
  food_diary_ingredients: z.array(FoodDiaryIngredientSchema),
});

// Full day schema with meals and summary
export const FoodDiaryDaySchema = z.object({
  entry_date: z.string().date(),
  meals: z.array(CombinedMealSchema), // Use combined meal schema
  daily_summary: DailyNutritionSummarySchema.nullable(), // Can be null for empty days
});

// ========================================
// API Schemas
// ========================================

export const FetchFoodDiaryDayPayloadSchema = z.object({
  entry_date: z.string().date(validationMessages.string.required("Entry date")),
});

export const CreateFoodDiaryMealPayloadSchema = FoodDiaryMealFormSchema;

export const UpdateFoodDiaryMealPayloadSchema = FoodDiaryMealFormSchema.extend({
  id: SupabaseId,
});

export const DeleteFoodDiaryMealPayloadSchema = z.object({
  id: SupabaseId,
});

export const ImportMealToFoodDiaryPayloadSchema = z.object({
  meal_id: SupabaseId,
  entry_date: z.string().date(validationMessages.string.required("Entry date")),
  meal_name: z.string().optional(), // Override meal name if desired
  meal_order: z
    .number()
    .min(1, {
      message: validationMessages.number.min("Meal order", 1),
    })
    .optional(),
});

export const UpdateFoodDiaryIngredientPayloadSchema = z.object({
  id: SupabaseId,
  quantity: z.number().positive({
    message: validationMessages.number.positive("Quantity"),
  }),
  total_calories: z.number().min(0),
  total_protein: z.number().min(0).optional(),
  total_carbs: z.number().min(0).optional(),
  total_fat: z.number().min(0).optional(),
});

export const DeleteFoodDiaryIngredientPayloadSchema = z.object({
  id: SupabaseId,
});

// Form schema for entire day - made consistent with optional nutrition values
export const FoodDiaryDayFormSchema = z.object({
  meals: z.array(
    z.object({
      id: z.string().optional(),
      entry_date: z.string(),
      meal_name: z.string().min(1),
      meal_order: z.number(),
      ingredients: z.array(
        z.object({
          ingredient_id: z.string(),
          quantity: z.number().positive(),
          total_calories: z.number(),
          total_protein: z.number().optional(), // Made consistent
          total_carbs: z.number().optional(), // Made consistent
          total_fat: z.number().optional(), // Made consistent
        })
      ),
    })
  ),
});

export type FoodDiaryDayForm = z.infer<typeof FoodDiaryDayFormSchema>;

// ========================================
// Types
// ========================================

export type FoodDiaryIngredient = z.infer<typeof FoodDiaryIngredientSchema>;
export type FoodDiaryMeal = z.infer<typeof FoodDiaryMealSchema>;
export type DetailedFoodDiaryMeal = z.infer<typeof DetailedFoodDiaryMealSchema>;
export type CombinedMeal = z.infer<typeof CombinedMealSchema>;
export type MealNutritionSummary = z.infer<typeof MealNutritionSummarySchema>;
export type DailyNutritionSummary = z.infer<typeof DailyNutritionSummarySchema>;
export type FoodDiaryDay = z.infer<typeof FoodDiaryDaySchema>;

// API Types
export type FetchFoodDiaryDayPayload = z.infer<typeof FetchFoodDiaryDayPayloadSchema>;
export type FetchFoodDiaryDayResponse = FoodDiaryDay;

// CRUD Types
export type CreateFoodDiaryMealPayload = z.infer<typeof CreateFoodDiaryMealPayloadSchema>;
export type UpdateFoodDiaryMealPayload = z.infer<typeof UpdateFoodDiaryMealPayloadSchema>;
export type DeleteFoodDiaryMealPayload = z.infer<typeof DeleteFoodDiaryMealPayloadSchema>;
export type ImportMealToFoodDiaryPayload = z.infer<typeof ImportMealToFoodDiaryPayloadSchema>;
export type UpdateFoodDiaryIngredientPayload = z.infer<
  typeof UpdateFoodDiaryIngredientPayloadSchema
>;
export type DeleteFoodDiaryIngredientPayload = z.infer<
  typeof DeleteFoodDiaryIngredientPayloadSchema
>;

// Response types
export type CreateFoodDiaryMealResponse = FoodDiaryMeal;
export type UpdateFoodDiaryMealResponse = FoodDiaryMeal;
export type DeleteFoodDiaryMealResponse = FoodDiaryMeal;
export type ImportMealToFoodDiaryResponse = FoodDiaryMeal;
export type UpdateFoodDiaryIngredientResponse = FoodDiaryIngredient;
export type DeleteFoodDiaryIngredientResponse = FoodDiaryIngredient;
