import { z } from "zod";

// ========================================
// Types & Schemas
// ========================================

export const MeasurementTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  display_order: z.number(),
});

// ========================================
// API Schemas
// ========================================

export const FetchMeasurementTypesPayloadSchema = z.object({
  category: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["name", "category", "display_order"]).optional(),
});

export const FetchMeasurementTypesResponseSchema = z.object({
  count: z.number(),
  data: z.array(MeasurementTypeSchema),
});

// ========================================
// Types
// ========================================

export type MeasurementType = z.infer<typeof MeasurementTypeSchema>;

// API Types
export type FetchMeasurementTypesPayload = z.infer<typeof FetchMeasurementTypesPayloadSchema>;
export type FetchMeasurementTypesResponse = z.infer<typeof FetchMeasurementTypesResponseSchema>;
