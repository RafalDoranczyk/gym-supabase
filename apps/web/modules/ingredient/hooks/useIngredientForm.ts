import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateIngredientPayloadSchema, type IngredientFormData } from "../schemas";

export const ingredientDefaultValues: IngredientFormData = {
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
  return useForm<IngredientFormData>({
    resolver: zodResolver(CreateIngredientPayloadSchema),
    defaultValues: ingredientDefaultValues,
  });
}
