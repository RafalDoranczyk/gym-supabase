import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateMealTagPayload,
  CreateMealTagPayloadSchema,
  type UpdateMealTagPayload,
} from "@repo/schemas";
import { useForm } from "react-hook-form";

export type MealTagForm = CreateMealTagPayload | UpdateMealTagPayload;

export const mealTagDefaultValues: MealTagForm = {
  name: "",
  description: "",
  color: "#8B5CF6",
};

export function useMealTagForm() {
  return useForm<CreateMealTagPayload>({
    resolver: zodResolver(CreateMealTagPayloadSchema),
    defaultValues: mealTagDefaultValues,
  });
}
