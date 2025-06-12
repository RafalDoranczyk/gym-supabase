import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateMealPayload,
  CreateMealPayloadSchema,
  type UpdateMealPayload,
} from "@repo/schemas";
import { useForm } from "react-hook-form";

export type MealForm = CreateMealPayload | UpdateMealPayload;

export const mealDefaultValues: MealForm = {
  name: "",
  description: "",
  ingredients: [],
  tag_ids: [],
};

export function useMealForm() {
  return useForm<MealForm>({
    resolver: zodResolver(CreateMealPayloadSchema),
    defaultValues: mealDefaultValues,
    mode: "onChange",
  });
}
