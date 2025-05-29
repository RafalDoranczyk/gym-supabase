import { z } from "zod";

import { SupabaseId } from "../shared";

export const NutritionGroupSchema = z.object({
  id: SupabaseId,
  name: z.string({ message: "Name is required" }).min(1, { message: "Name is required" }),
});

export type NutritionGroup = z.infer<typeof NutritionGroupSchema>;

export const GetNutritionGroupResponseSchema = z.array(NutritionGroupSchema);

export type GetNutritionGroupResponse = z.infer<typeof GetNutritionGroupResponseSchema>;
