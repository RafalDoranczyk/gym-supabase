import { z } from "zod";

export const MeasurementTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  display_order: z.number(),
});

export type MeasurementType = z.infer<typeof MeasurementTypeSchema>;
