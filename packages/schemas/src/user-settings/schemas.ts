import { z } from "zod";
import { UNIT_SYSTEMS } from "./constants";

// Base schema for the database table - minimal start
export const UserPreferencesSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  unit_system: z.enum(Object.values(UNIT_SYSTEMS) as [string, ...string[]]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Schema for creating new preferences (omits generated fields)
export const CreateUserPreferencesPayloadSchema = UserPreferencesSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for updating preferences (optional fields except user_id)
export const UpdateUserPreferencesPayloadSchema = UserPreferencesSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
}).partial();

// Schema for fetching preferences response
export const FetchUserPreferencesResponseSchema = UserPreferencesSchema.nullable();

// Type exports
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type CreateUserPreferencesPayload = z.infer<typeof CreateUserPreferencesPayloadSchema>;
export type UpdateUserPreferencesPayload = z.infer<typeof UpdateUserPreferencesPayloadSchema>;
export type FetchUserPreferencesResponse = z.infer<typeof FetchUserPreferencesResponseSchema>;

// Helper types
export type UnitSystem = keyof typeof UNIT_SYSTEMS;
