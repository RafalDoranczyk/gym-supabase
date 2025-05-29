import { z } from 'zod';

import { SupabaseId } from '../shared';

export const MealTagSchema = z.object({
  id: SupabaseId,
  name: z.string(),
});

export type MealTag = z.infer<typeof MealTagSchema>;

export const GetMealTagsResponseSchema = z.object({
  tags: z.array(MealTagSchema),
});
export type GetMealTagsResponse = z.infer<typeof GetMealTagsResponseSchema>;
