import { z } from "zod";

import { SearchString } from "../shared";

export const MealSearchParamsSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["name", "created_at"]).optional(),
  search: SearchString,
  tag: z.string().optional(),
});

export type MealSearchParams = z.infer<typeof MealSearchParamsSchema>;
