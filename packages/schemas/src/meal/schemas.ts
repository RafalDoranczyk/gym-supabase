import { z } from "zod";

import { IngredientSchema } from "../ingredient";
import { MealTagSchema, MealToTagSchema } from "../mealTag/schemas";
import { CreatedAt, SupabaseId } from "../shared";
import { validationMessages } from "../shared/validationMessages";
import { MEAL_DESCRIPTION_MAX_LENGTH, MEAL_NAME_MAX_LENGTH, MEAL_NAME_MIN_LENGTH } from "./consts";

// Minimal Ingredient shape used inside MealIngredient (picked from full schema)
const MinimalIngredientSchema = IngredientSchema.pick({
  calories: true,
  carbs: true,
  fat: true,
  id: true,
  name: true,
  price: true,
  protein: true,
  unit_type: true,
});

// Ingredient used in meal with relationship data
const MealIngredientSchema = z.object({
  amount: z.number().positive({
    message: validationMessages.number.positive("Amount"),
  }),
  ingredient: MinimalIngredientSchema,
});
export type MealIngredient = z.infer<typeof MealIngredientSchema>;

// Base meal schema (used for create/update payloads)
export const BaseMealSchema = z.object({
  name: z
    .string()
    .min(MEAL_NAME_MIN_LENGTH, {
      message: validationMessages.string.min("Name", MEAL_NAME_MIN_LENGTH),
    })
    .max(MEAL_NAME_MAX_LENGTH, {
      message: validationMessages.string.max("Name", MEAL_NAME_MAX_LENGTH),
    })
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(MEAL_DESCRIPTION_MAX_LENGTH, {
      message: validationMessages.string.max("Description", MEAL_DESCRIPTION_MAX_LENGTH),
    })
    .optional()
    .or(z.literal("")),
});

// Full meal schema with relations (from DB)
export const MealSchema = BaseMealSchema.extend({
  id: SupabaseId,
  created_at: CreatedAt,
  user_id: SupabaseId,
  meal_ingredients: z.array(MealIngredientSchema).optional(),
  meal_to_tags: z.array(MealToTagSchema).optional(),
});

export type Meal = z.infer<typeof MealSchema>;

// Create payload - simplified for form submission
export const CreateMealPayloadSchema = BaseMealSchema.extend({
  ingredients: z
    .array(
      z.object({
        ingredient_id: SupabaseId,
        amount: z.number().positive({
          message: validationMessages.number.positive("Amount"),
        }),
      }),
    )
    .min(1, {
      message: "Meal must have at least one ingredient",
    }),

  tag_ids: z.array(SupabaseId).optional(),
});
export type CreateMealPayload = z.infer<typeof CreateMealPayloadSchema>;
export type CreateMealResponse = Meal;

// Update payload
export const UpdateMealPayloadSchema = CreateMealPayloadSchema.extend({
  id: SupabaseId,
});
export type UpdateMealPayload = z.infer<typeof UpdateMealPayloadSchema>;
export type UpdateMealResponse = Meal;

// Delete
export const DeleteMealPayloadSchema = SupabaseId;
export type DeleteMealPayload = z.infer<typeof DeleteMealPayloadSchema>;
export type DeleteMealResponse = Meal;

// Get meals response
export const GetMealsResponseSchema = z.object({
  count: z.number(),
  data: z.array(MealSchema),
});
export type GetMealsResponse = z.infer<typeof GetMealsResponseSchema>;

// Meal with populated ingredients (for detailed view)
export const DetailedMealSchema = MealSchema.extend({
  meal_ingredients: z.array(MealIngredientSchema), // Required for detailed view
  tags: z.array(MealTagSchema), // Required for detailed view
});
export type DetailedMeal = z.infer<typeof DetailedMealSchema>;
