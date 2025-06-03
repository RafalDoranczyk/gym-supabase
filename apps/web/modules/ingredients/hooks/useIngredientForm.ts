import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateIngredientPayload, CreateIngredientPayloadSchema } from "@repo/schemas";
import { useForm } from "react-hook-form";

/**
 * Default values for creating a new ingredient
 * Used for form initialization and reset operations
 */
export const ingredientDefaultValues: CreateIngredientPayload = {
  calories: 0,
  carbs: 0,
  fat: 0,
  group_id: "",
  name: "",
  price: 0,
  protein: 0,
  unit_type: "g",
};

/**
 * Form hook for ingredient create/update operations
 * Provides validated form with Zod schema integration
 */
export function useIngredientForm() {
  return useForm<CreateIngredientPayload>({
    resolver: zodResolver(CreateIngredientPayloadSchema),
    defaultValues: ingredientDefaultValues,
  });
}
