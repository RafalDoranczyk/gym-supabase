import { z } from "zod";
import { CreatedAt, SupabaseId } from "../shared";
import { validationMessages } from "../shared/validationMessages";

const NUTRITION_GROUP_NAME_MIN_LENGTH = 1;
const NUTRITION_GROUP_NAME_MAX_LENGTH = 100;

// Base nutrition group schema (used for create/update payloads)
export const BaseNutritionGroupSchema = z.object({
  name: z
    .string()
    .min(NUTRITION_GROUP_NAME_MIN_LENGTH, {
      message: validationMessages.string.min("Name", NUTRITION_GROUP_NAME_MIN_LENGTH),
    })
    .max(NUTRITION_GROUP_NAME_MAX_LENGTH, {
      message: validationMessages.string.max("Name", NUTRITION_GROUP_NAME_MAX_LENGTH),
    }),
  description: z.string().nullable(),
  color: z.string().min(1, {
    message: "Color is required",
  }),
});

// Full nutrition group from DB
export const NutritionGroupSchema = BaseNutritionGroupSchema.extend({
  created_at: CreatedAt,
  id: SupabaseId,
  user_id: SupabaseId,
  updated_at: CreatedAt.nullable(),
});
export type NutritionGroup = z.infer<typeof NutritionGroupSchema>;

// Get all
export const GetNutritionGroupsResponseSchema = z.object({
  count: z.number(),
  data: z.array(NutritionGroupSchema),
});
export type GetNutritionGroupsResponse = z.infer<typeof GetNutritionGroupsResponseSchema>;

// Extended schema with examples
export const NutritionGroupWithExamplesSchema = NutritionGroupSchema.extend({
  ingredientsCount: z.number(),
  examples: z.array(z.string()),
});
export type NutritionGroupWithExamples = z.infer<typeof NutritionGroupWithExamplesSchema>;

export const GetNutritionGroupsWithExamplesResponseSchema = z.object({
  count: z.number(),
  data: z.array(NutritionGroupWithExamplesSchema),
});
export type GetNutritionGroupsWithExamplesResponse = z.infer<
  typeof GetNutritionGroupsWithExamplesResponseSchema
>;

// Create
export const CreateNutritionGroupPayloadSchema = BaseNutritionGroupSchema;
export type CreateNutritionGroupPayload = z.infer<typeof CreateNutritionGroupPayloadSchema>;
export type CreateNutritionGroupResponse = z.infer<typeof NutritionGroupSchema>;

// Update
export const UpdateNutritionGroupPayloadSchema = BaseNutritionGroupSchema.extend({
  id: SupabaseId,
});
export type UpdateNutritionGroupPayload = z.infer<typeof UpdateNutritionGroupPayloadSchema>;
export type UpdateNutritionGroupResponse = z.infer<typeof NutritionGroupSchema>;

// Delete
export const DeleteNutritionGroupPayloadSchema = SupabaseId;
export type DeleteNutritionGroupPayload = z.infer<typeof DeleteNutritionGroupPayloadSchema>;
export type DeleteNutritionGroupResponse = z.infer<typeof NutritionGroupSchema>;
