import { useToast } from "@/providers";
import type { CombinedMeal } from "@repo/schemas";
import { useEffect, useState, useTransition } from "react";
import { createFoodDiaryMeal } from "../actions/createFoodDiary";
import { deleteFoodDiaryMeals } from "../actions/deleteFoodDiaryMeal";
import { updateFoodDiaryMeal } from "../actions/updateFoodDiaryMeal";
import type { MealSaveHandler } from "./useFoodDiaryMealForm";

type UseFoodDiaryProps = {
  selectedDate: string;
  initialMeals: CombinedMeal[];
};

export function useFoodDiary({ selectedDate, initialMeals }: UseFoodDiaryProps) {
  const toast = useToast();

  const [isPending, startTransition] = useTransition();
  const [meals, setMeals] = useState<CombinedMeal[]>(initialMeals);
  const [isCreating, setIsCreating] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());
  const [deletedMealIds, setDeletedMealIds] = useState<Set<string>>(new Set());
  const [modifiedMeals, setModifiedMeals] = useState<Map<string, CombinedMeal>>(new Map());

  // Reset when date changes
  useEffect(() => {
    setMeals(initialMeals);
    setIsCreating(false);
    setEditingMealId(null);
    setPendingChanges(new Set());
    setDeletedMealIds(new Set());
    setModifiedMeals(new Map());
  }, [initialMeals]);

  // Visible meals (filter out deleted)
  const visibleMeals = meals.filter((meal) => !deletedMealIds.has(meal.id));

  const getNextMealOrder = () => {
    if (visibleMeals.length === 0) return 1;
    const maxOrder = Math.max(...visibleMeals.map((meal) => meal.meal_order || 0));
    return maxOrder + 1;
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingMealId(null);
  };

  const startEditing = (mealId: string) => {
    setIsCreating(false);
    setEditingMealId(mealId);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingMealId(null);
  };

  const onEditFinish = () => {
    setIsCreating(false);
    setEditingMealId(null);
  };

  // Helper function to transform FoodDiaryMeal to CombinedMeal
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const transformToCombinedMeal = (meal: any): CombinedMeal => {
    // If API returns basic FoodDiaryMeal, we need to calculate totals
    // Or fetch from meal_nutrition_summary view
    // For now, assuming API returns proper format
    return meal as CombinedMeal;
  };

  const handleMealSave: MealSaveHandler = async (mealData, isNew) => {
    try {
      if (isNew) {
        // Create new meal - local save for consistency
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newMeal: CombinedMeal = {
          id: tempId,
          user_id: "", // Will be set by backend
          entry_date: mealData.entry_date,
          meal_name: mealData.meal_name,
          meal_order: mealData.meal_order || getNextMealOrder(),
          created_at: new Date().toISOString(),
          // updated_at: new Date().toISOString(),
          food_diary_ingredients:
            mealData.ingredients?.map((ing) => ({
              id: `temp-ing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              diary_meal_id: tempId,
              ingredient_id: ing.ingredient_id,
              quantity: ing.quantity,
              total_calories: ing.total_calories,
              total_protein: ing.total_protein || 0,
              total_carbs: ing.total_carbs || 0,
              total_fat: ing.total_fat || 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              ingredient: {
                id: ing.ingredient_id,
                name: "",
                unit_type: "g",
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
              },
            })) || [],
          // Calculate totals from ingredients
          total_calories:
            mealData.ingredients?.reduce((sum, ing) => sum + ing.total_calories, 0) || 0,
          total_protein:
            mealData.ingredients?.reduce((sum, ing) => sum + (ing.total_protein || 0), 0) || 0,
          total_carbs:
            mealData.ingredients?.reduce((sum, ing) => sum + (ing.total_carbs || 0), 0) || 0,
          total_fat: mealData.ingredients?.reduce((sum, ing) => sum + (ing.total_fat || 0), 0) || 0,
          ingredient_count: mealData.ingredients?.length || 0,
        };

        // Add to local state
        setMeals((prev) =>
          [...prev, newMeal].sort((a, b) => (a.meal_order || 0) - (b.meal_order || 0))
        );

        // Mark as new meal for batch save
        setModifiedMeals((prev) => new Map(prev).set(tempId, newMeal));
        setPendingChanges((prev) => new Set(prev).add(tempId));

        setIsCreating(false);
        toast.success("New meal added locally - click 'Save All' to sync");
      } else {
        // Update existing meal - batch save approach
        if (!("id" in mealData)) {
          throw new Error("Missing meal ID for update");
        }

        // Create updated meal object
        const existingMeal = meals.find((m) => m.id === mealData.id);
        if (!existingMeal) {
          throw new Error("Meal not found");
        }

        const updatedMeal: CombinedMeal = {
          ...existingMeal,
          meal_name: mealData.meal_name,
          meal_order: mealData.meal_order || 0,
          entry_date: mealData.entry_date,
          food_diary_ingredients:
            mealData.ingredients?.map((ing) => ({
              id: "", // Will be set by backend
              diary_meal_id: mealData.id,
              ingredient_id: ing.ingredient_id,
              quantity: ing.quantity,
              total_calories: ing.total_calories,
              total_protein: ing.total_protein || 0,
              total_carbs: ing.total_carbs || 0,
              total_fat: ing.total_fat || 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              ingredient: {
                id: ing.ingredient_id,
                name: "",
                unit_type: "g",
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
              },
            })) || [],
          // Recalculate totals from ingredients
          total_calories:
            mealData.ingredients?.reduce((sum, ing) => sum + ing.total_calories, 0) || 0,
          total_protein:
            mealData.ingredients?.reduce((sum, ing) => sum + (ing.total_protein || 0), 0) || 0,
          total_carbs:
            mealData.ingredients?.reduce((sum, ing) => sum + (ing.total_carbs || 0), 0) || 0,
          total_fat: mealData.ingredients?.reduce((sum, ing) => sum + (ing.total_fat || 0), 0) || 0,
          ingredient_count: mealData.ingredients?.length || 0,
        };

        // Update local state immediately (optimistic update)
        setMeals((prev) => prev.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal)));

        // Mark as modified for batch save
        setModifiedMeals((prev) => new Map(prev).set(mealData.id, updatedMeal));
        setPendingChanges((prev) => new Set(prev).add(mealData.id));

        setEditingMealId(null);
        toast.success("Changes saved locally - click 'Save All' to sync");
      }
    } catch {
      toast.error("Failed to save meal");
    }
  };

  // Soft delete - instant local removal
  const handleMealDelete = async (mealId: string) => {
    // Mark as deleted locally (instant feedback)
    setDeletedMealIds((prev) => new Set(prev).add(mealId));

    // Clear editing state if deleting current editing meal
    if (editingMealId === mealId) {
      setEditingMealId(null);
    }

    // Remove from pending changes since it's deleted
    setPendingChanges((prev) => {
      const newSet = new Set(prev);
      newSet.delete(mealId);
      return newSet;
    });

    // Remove from modified meals since it's deleted
    setModifiedMeals((prev) => {
      const newMap = new Map(prev);
      newMap.delete(mealId);
      return newMap;
    });

    toast.success("Meal deleted");
  };

  // Restore deleted meal (optional undo feature)
  const restoreMeal = (mealId: string) => {
    setDeletedMealIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(mealId);
      return newSet;
    });
    toast.success("Meal restored");
  };

  const markMealAsChanged = (mealId: string) => {
    setPendingChanges((prev) => new Set(prev).add(mealId));
  };

  const saveAll = () => {
    const hasUpdates = pendingChanges.size > 0;
    const hasDeletes = deletedMealIds.size > 0;

    if (!(hasUpdates || hasDeletes)) {
      toast.success("No changes to save");
      return;
    }

    startTransition(async () => {
      try {
        let updateCount = 0;
        let deleteCount = 0;

        // Process updates - handle both new and existing meals
        if (hasUpdates) {
          const changesToSave = Array.from(pendingChanges);

          for (const mealId of changesToSave) {
            const modifiedMeal = modifiedMeals.get(mealId);
            if (modifiedMeal && !deletedMealIds.has(mealId)) {
              // Check if it's a new meal (temp ID)
              if (mealId.startsWith("temp-")) {
                // Create new meal
                const savedMeal = await createFoodDiaryMeal({
                  entry_date: modifiedMeal.entry_date,
                  meal_name: modifiedMeal.meal_name,
                  meal_order: modifiedMeal.meal_order,
                  ingredients:
                    modifiedMeal.food_diary_ingredients?.map((ing) => ({
                      ingredient_id: ing.ingredient_id,
                      quantity: ing.quantity,
                      total_calories: ing.total_calories,
                      total_protein: ing.total_protein || 0,
                      total_carbs: ing.total_carbs || 0,
                      total_fat: ing.total_fat || 0,
                    })) || [],
                });

                // Replace temp meal with real meal in state
                const realMeal = transformToCombinedMeal(savedMeal);
                setMeals((prev) => prev.map((meal) => (meal.id === mealId ? realMeal : meal)));
                updateCount++;
              } else {
                // Update existing meal
                await updateFoodDiaryMeal({
                  id: modifiedMeal.id,
                  entry_date: modifiedMeal.entry_date,
                  meal_name: modifiedMeal.meal_name,
                  meal_order: modifiedMeal.meal_order,
                  ingredients:
                    modifiedMeal.food_diary_ingredients?.map((ing) => ({
                      ingredient_id: ing.ingredient_id,
                      quantity: ing.quantity,
                      total_calories: ing.total_calories,
                      total_protein: ing.total_protein || 0,
                      total_carbs: ing.total_carbs || 0,
                      total_fat: ing.total_fat || 0,
                    })) || [],
                });
                updateCount++;
              }
            }
          }
        }

        // Process deletes
        if (hasDeletes) {
          const mealsToDelete = Array.from(deletedMealIds).filter(
            (id) =>
              // Only delete meals that exist in DB (not temp/new meals)
              !id.startsWith("temp-")
          );

          if (mealsToDelete.length > 0) {
            await deleteFoodDiaryMeals(mealsToDelete);
            deleteCount = mealsToDelete.length;
          }

          // Remove deleted meals from state
          setMeals((prev) => prev.filter((meal) => !deletedMealIds.has(meal.id)));
        }

        // Clear all pending states
        setPendingChanges(new Set());
        setDeletedMealIds(new Set());
        setModifiedMeals(new Map());

        // Success message
        const messages = [];
        if (updateCount > 0) messages.push(`${updateCount} meal(s) updated`);
        if (deleteCount > 0) messages.push(`${deleteCount} meal(s) deleted`);

        toast.success(messages.join(", "));
      } catch {
        toast.error("Failed to save changes");
      }
    });
  };

  const hasPendingChanges = pendingChanges.size > 0 || deletedMealIds.size > 0;

  return {
    // Data
    meals: visibleMeals, // Return filtered meals
    selectedDate,

    // State
    hasPendingChanges,
    isPending,
    isCreating,
    isEditing: editingMealId !== null,
    editingMealId,
    deletedMealIds, // Expose for potential undo UI

    // Actions
    startCreating,
    startEditing,
    cancelEdit,
    onEditFinish,
    handleMealSave,
    handleMealDelete,
    restoreMeal, // Optional undo feature
    markMealAsChanged,
    saveAll,
    startTransition,
  };
}
