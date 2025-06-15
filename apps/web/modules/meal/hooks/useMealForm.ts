import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateMealPayloadSchema, type MealFormData } from "../schemas";

export const mealDefaultValues: MealFormData = {
  name: "",
  description: "",
  ingredients: [],
  tag_ids: [],
};

export function useMealForm() {
  return useForm<MealFormData>({
    resolver: zodResolver(CreateMealPayloadSchema),
    defaultValues: mealDefaultValues,
    mode: "onChange",
  });
}
