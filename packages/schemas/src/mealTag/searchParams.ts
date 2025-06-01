import { z } from "zod";

// Search params for filtering tags
export const MealTagSearchParamsSchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  order: z.enum(["asc", "desc"]).default("asc"),
  orderBy: z.enum(["name", "created_at"]).default("name"),
});
export type MealTagSearchParams = z.infer<typeof MealTagSearchParamsSchema>;
