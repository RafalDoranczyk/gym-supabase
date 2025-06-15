import type { Ingredient } from "@/modules/ingredient";
import { calculateIngredientNutrition } from "@/modules/meal";
import { roundToTwoDecimals } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import type {
  CombinedMeal,
  CreateFoodDiaryMealPayload,
  UpdateFoodDiaryMealPayload,
} from "../schemas";

export type MealSaveHandler = (
  data: CreateFoodDiaryMealPayload | UpdateFoodDiaryMealPayload,
  isNew: boolean
) => Promise<void>;

const MealFormSchema = z.object({
  meal_name: z.string().min(1, "Meal name is required"),
  entry_date: z.string().date(),
  meal_order: z.number().min(1),
  ingredients: z
    .array(
      z.object({
        ingredient_id: z.string(),
        quantity: z.number().min(0.1, "Quantity must be greater than 0"), // avoid 0 quantities
        total_calories: z.number().min(0),
        total_protein: z.number().min(0),
        total_carbs: z.number().min(0),
        total_fat: z.number().min(0),
      })
    )
    .default([]),
});

type MealFormData = z.infer<typeof MealFormSchema>;

const DEFAULT_QUANTITY = {
  g: 100,
  kg: 0.1, // 100g = 0.1kg makes more sense
  default: 1,
} as const;

type UseFoodDiaryMealFormProps = {
  meal?: CombinedMeal;
  availableIngredients: Ingredient[];
  selectedDate: string;
  onSave: MealSaveHandler;
  onCancel: () => void;
};

export function useFoodDiaryMealForm({
  meal,
  availableIngredients,
  selectedDate,
  onSave,
  onCancel,
}: UseFoodDiaryMealFormProps) {
  const isEditing = !!meal;

  // Calculate next meal order for new meals
  const getNextMealOrder = () => {
    // This should come from parent component or context
    // For now, default to 1
    return meal?.meal_order || 1;
  };

  const form = useForm<MealFormData>({
    resolver: zodResolver(MealFormSchema),
    defaultValues: {
      meal_name: meal?.meal_name || "",
      entry_date: meal?.entry_date || selectedDate,
      meal_order: meal?.meal_order || getNextMealOrder(),
      ingredients:
        meal?.food_diary_ingredients?.map((ing) => ({
          ingredient_id: ing.ingredient_id,
          quantity: ing.quantity,
          total_calories: ing.total_calories,
          total_protein: ing.total_protein || 0,
          total_carbs: ing.total_carbs || 0,
          total_fat: ing.total_fat || 0,
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const watchedIngredients = form.watch("ingredients");

  // Find ingredient by ID
  const findIngredientById = (id: string) => availableIngredients.find((ing) => ing.id === id);

  // Calculate total nutrition from form data (live updates)
  const totalNutrition = useMemo(() => {
    return watchedIngredients.reduce(
      (total, ingredient) => ({
        calories: roundToTwoDecimals(total.calories + (ingredient.total_calories || 0)),
        protein: roundToTwoDecimals(total.protein + (ingredient.total_protein || 0)),
        carbs: roundToTwoDecimals(total.carbs + (ingredient.total_carbs || 0)),
        fat: roundToTwoDecimals(total.fat + (ingredient.total_fat || 0)),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [watchedIngredients]);

  const handleAddIngredient = (ingredient: Ingredient | null) => {
    if (!ingredient) return;

    const { unit_type, id } = ingredient;

    // Check if already added
    if (fields.some((field) => field.ingredient_id === id)) return;

    const quantity =
      unit_type === "g"
        ? DEFAULT_QUANTITY.g
        : unit_type === "kg"
          ? DEFAULT_QUANTITY.kg
          : DEFAULT_QUANTITY.default;

    const nutrition = calculateIngredientNutrition({ amount: quantity, ingredient });

    append({
      ingredient_id: id,
      quantity,
      total_calories: nutrition.calories,
      total_protein: nutrition.protein,
      total_carbs: nutrition.carbs,
      total_fat: nutrition.fat,
    });
  };

  const updateIngredientNutrition = (index: number, newQuantity: number, ingredientId: string) => {
    if (newQuantity <= 0) return; // Prevent invalid quantities

    const ingredient = findIngredientById(ingredientId);
    if (!ingredient) return;

    const nutrition = calculateIngredientNutrition({ amount: newQuantity, ingredient });

    // Batch updates for better performance
    form.setValue(`ingredients.${index}.quantity`, newQuantity);
    form.setValue(`ingredients.${index}.total_calories`, nutrition.calories);
    form.setValue(`ingredients.${index}.total_protein`, nutrition.protein);
    form.setValue(`ingredients.${index}.total_carbs`, nutrition.carbs);
    form.setValue(`ingredients.${index}.total_fat`, nutrition.fat);
  };

  const handleSave = form.handleSubmit(async (data) => {
    if (isEditing && meal) {
      // For updates, include the meal ID
      const updateData: UpdateFoodDiaryMealPayload = {
        id: meal.id,
        entry_date: data.entry_date,
        meal_name: data.meal_name,
        meal_order: data.meal_order,
        ingredients: data.ingredients,
      };
      await onSave(updateData, false);
    } else {
      // For creates, don't include ID
      const createData: CreateFoodDiaryMealPayload = {
        entry_date: data.entry_date,
        meal_name: data.meal_name,
        meal_order: data.meal_order,
        ingredients: data.ingredients,
      };
      await onSave(createData, true);
    }
  });

  const availableOptions = useMemo(
    () =>
      availableIngredients.filter((ing) => !fields.some((field) => field.ingredient_id === ing.id)),
    [availableIngredients, fields]
  );

  const removeIngredient = (index: number) => {
    remove(index);
  };

  return {
    form,
    fields,
    watchedIngredients,
    totalNutrition,
    isEditing,
    availableOptions,
    findIngredientById,
    handleAddIngredient,
    updateIngredientNutrition,
    handleSave,
    handleCancel: onCancel,
    removeIngredient,
  };
}
