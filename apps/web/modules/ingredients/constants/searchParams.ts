import { z } from "zod";

export const IngredientSearchParamsSchema = z.object({
  group: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["name", "unit_type", "calories"]).optional(),
});
export type IngredientSearchParams = z.infer<typeof IngredientSearchParamsSchema>;
