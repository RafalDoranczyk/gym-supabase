import { z } from 'zod';

import { CreatedAt, SupabaseId, validationMessages } from '../shared';

export const MeasurementsSchema = z.object({
  created_at: CreatedAt,
  id: SupabaseId,
  user_id: SupabaseId,
  weight: z.number().min(0, {
    message: validationMessages.number.min('Weight', 0),
  }),
});
export type Measurements = z.infer<typeof MeasurementsSchema>;

// ---------- GET ----------
export const GetMeasurementsResponseSchema = z.object({
  count: z.number(),
  data: MeasurementsSchema.array(),
});

export type GetMeasurementsResponse = z.infer<typeof GetMeasurementsResponseSchema>;

// ---------- SET ----------
export const SetMeasurementsPayloadSchema = MeasurementsSchema.omit({ id: true }).extend({
  id: z.number().optional(),
});
export type SetMeasurementsPayload = z.infer<typeof SetMeasurementsPayloadSchema>;

export const SetMeasurementsResponseSchema = z.object({
  measurements: MeasurementsSchema,
  message: z.string(),
});
export type SetMeasurementsResponse = z.infer<typeof SetMeasurementsResponseSchema>;

// ---------- REMOVE ----------
export const RemoveMeasurementsPayloadSchema = z.object({
  created_at: CreatedAt,
});
export type RemoveMeasurementsPayload = z.infer<typeof RemoveMeasurementsPayloadSchema>;

export const RemoveMeasurementsResponseSchema = z.object({
  created_at: CreatedAt,
  message: z.string(),
});
export type RemoveMeasurementsResponse = z.infer<typeof RemoveMeasurementsResponseSchema>;
