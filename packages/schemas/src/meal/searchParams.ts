import { z } from "zod";

import { SearchString } from "../shared";

// Search params for filtering meals
export const MealSearchParamsSchema = z.object({
  search: SearchString,
  tag: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["name", "created_at"]).default("created_at").optional(),
});
export type MealSearchParams = z.infer<typeof MealSearchParamsSchema>;
