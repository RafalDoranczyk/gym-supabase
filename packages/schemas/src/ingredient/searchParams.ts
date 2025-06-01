import { z } from "zod";

import { SearchString } from "../shared";
import { INGREDIENTS_FETCH_LIMIT } from "./const";

export const IngredientSearchParamsSchema = z.object({
  group: z.string().default(""),
  limit: z.coerce.number().min(1).max(100).default(INGREDIENTS_FETCH_LIMIT),
  offset: z.coerce.number().min(0).default(0),
  order: z.enum(["asc", "desc"]).default("asc"),
  orderBy: z
    .enum(["name", "unit_type", "calories", "carbs", "protein", "fat", "price"])
    .default("name"),
  search: SearchString,
});

export type IngredientSearchParams = z.infer<typeof IngredientSearchParamsSchema>;
