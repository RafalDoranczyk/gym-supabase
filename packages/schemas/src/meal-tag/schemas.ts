import { z } from "zod";

import { CreatedAt, SupabaseId } from "../shared";
import { validationMessages } from "../shared/validationMessages";
import {
  MEAL_TAG_DESCRIPTION_MAX_LENGTH,
  MEAL_TAG_NAME_MAX_LENGTH,
  MEAL_TAG_NAME_MIN_LENGTH,
} from "./constants";

// ========================================
// Types & Schemas
// ========================================

export const MealTagFormSchema = z.object({
  name: z
    .string()
    .min(MEAL_TAG_NAME_MIN_LENGTH, {
      message: validationMessages.string.min("Tag name", MEAL_TAG_NAME_MIN_LENGTH),
    })
    .max(MEAL_TAG_NAME_MAX_LENGTH, {
      message: validationMessages.string.max("Tag name", MEAL_TAG_NAME_MAX_LENGTH),
    })
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(MEAL_TAG_DESCRIPTION_MAX_LENGTH, {
      message: validationMessages.string.max("Description", MEAL_TAG_DESCRIPTION_MAX_LENGTH),
    })
    .nullable()
    .optional(),
  color: z.string().min(1, {
    message: validationMessages.string.required("Color"),
  }),
});

export const MealTagSchema = MealTagFormSchema.extend({
  id: SupabaseId,
  user_id: SupabaseId,
  created_at: CreatedAt,
  updated_at: CreatedAt,
});

// Helper schema for meal-to-tag relations
export const MealToTagSchema = z.object({
  tag: MealTagSchema.pick({
    id: true,
    name: true,
  }),
});

// Extended schema with additional computed fields
export const MealTagWithExamplesSchema = MealTagSchema.extend({
  mealsCount: z.number(),
  examples: z.array(z.string()),
});

// ========================================
// API Schemas
// ========================================

export const FetchMealTagsPayloadSchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["name", "created_at"]).optional(),
});

export const FetchMealTagsResponseSchema = z.object({
  count: z.number(),
  data: z.array(MealTagSchema),
});

export const FetchMealTagsWithExamplesResponseSchema = z.object({
  count: z.number(),
  data: z.array(MealTagWithExamplesSchema),
});

export const CreateMealTagPayloadSchema = MealTagFormSchema;

export const UpdateMealTagPayloadSchema = MealTagFormSchema.extend({
  id: SupabaseId,
});

export const DeleteMealTagPayloadSchema = z.object({
  id: SupabaseId,
});

// ========================================
// Types
// ========================================

export type MealTag = z.infer<typeof MealTagSchema>;
export type MealTagWithExamples = z.infer<typeof MealTagWithExamplesSchema>;

// API Types
export type FetchMealTagsPayload = z.infer<typeof FetchMealTagsPayloadSchema>;
export type FetchMealTagsResponse = z.infer<typeof FetchMealTagsResponseSchema>;
export type FetchMealTagsWithExamplesResponse = z.infer<
  typeof FetchMealTagsWithExamplesResponseSchema
>;

// CRUD Types
export type CreateMealTagPayload = z.infer<typeof CreateMealTagPayloadSchema>;
export type UpdateMealTagPayload = z.infer<typeof UpdateMealTagPayloadSchema>;
export type DeleteMealTagPayload = z.infer<typeof DeleteMealTagPayloadSchema>;

// Response types
export type CreateMealTagResponse = MealTag;
export type UpdateMealTagResponse = MealTag;
export type DeleteMealTagResponse = MealTag;
