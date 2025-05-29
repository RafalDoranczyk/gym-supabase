import { z } from "zod";

import { SearchString } from "../shared";

export const IngredientSearchParamsSchema = z.object({
  group: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["name", "unit_type", "calories", "carbs", "protein", "fat", "price"]).optional(),
  search: SearchString,
});

export type IngredientSearchParams = z.infer<typeof IngredientSearchParamsSchema>;
