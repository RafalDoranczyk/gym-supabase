import { z } from "zod";

import { CreatedAt, SupabaseId } from "../shared";
import { validationMessages } from "../shared/validationMessages";
import {
  MEAL_TAG_DESCRIPTION_MAX_LENGTH,
  MEAL_TAG_NAME_MAX_LENGTH,
  MEAL_TAG_NAME_MIN_LENGTH,
} from "./const";

// Base meal tag schema (for create/update payloads)
export const BaseMealTagSchema = z.object({
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
    .nullable(),
  color: z.string().min(1, {
    message: "Color is required",
  }),
});

// Full meal tag from DB
export const MealTagSchema = BaseMealTagSchema.extend({
  id: SupabaseId,
  created_at: CreatedAt,
  user_id: SupabaseId,
  updated_at: CreatedAt,
});

export const MealToTagSchema = z.object({
  tag: MealTagSchema.pick({
    id: true,
    name: true,
  }),
});

export type MealTag = z.infer<typeof MealTagSchema>;

// Get all tags
export const GetMealTagsResponseSchema = z.object({
  count: z.number(),
  data: z.array(MealTagSchema),
});
export type GetMealTagsResponse = z.infer<typeof GetMealTagsResponseSchema>;

// Create
export const CreateMealTagPayloadSchema = BaseMealTagSchema;
export type CreateMealTagPayload = z.infer<typeof CreateMealTagPayloadSchema>;
export type CreateMealTagResponse = z.infer<typeof MealTagSchema>;

// Update
export const UpdateMealTagPayloadSchema = BaseMealTagSchema.extend({
  id: SupabaseId,
});
export type UpdateMealTagPayload = z.infer<typeof UpdateMealTagPayloadSchema>;
export type UpdateMealTagResponse = z.infer<typeof MealTagSchema>;

// Delete
export const DeleteMealTagPayloadSchema = SupabaseId;
export type DeleteMealTagPayload = z.infer<typeof DeleteMealTagPayloadSchema>;
export type DeleteMealTagResponse = z.infer<typeof MealTagSchema>;

// Add to schemas
export const MealTagWithExamplesSchema = MealTagSchema.extend({
  mealsCount: z.number(),
  examples: z.array(z.string()),
});

export const FetchMealTagPayloadSchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  order: z.enum(["asc", "desc"]).default("asc"),
  orderBy: z.enum(["name", "created_at"]).default("name"),
});
export type FetchMealTagPayload = z.infer<typeof FetchMealTagPayloadSchema>;

export type MealTagWithExamples = z.infer<typeof MealTagWithExamplesSchema>;

export const GetMealTagsWithExamplesResponseSchema = z.object({
  count: z.number(),
  data: z.array(MealTagWithExamplesSchema),
});
export type GetMealTagsWithExamplesResponse = z.infer<typeof GetMealTagsWithExamplesResponseSchema>;
