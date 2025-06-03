import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateIngredientPayload,
  CreateIngredientPayloadSchema,
  type UpdateIngredientPayload,
} from "@repo/schemas";

import { useForm } from "react-hook-form";

export type IngredientForm = CreateIngredientPayload | UpdateIngredientPayload;

export const ingredientDefaultValues: IngredientForm = {
  calories: 0,
  carbs: 0,
  fat: 0,
  group_id: "",
  name: "",
  price: 0,
  protein: 0,
  unit_type: "g",
};

export function useIngredientForm() {
  return useForm<CreateIngredientPayload>({
    resolver: zodResolver(CreateIngredientPayloadSchema),
    defaultValues: ingredientDefaultValues,
  });
}
