"use client";

import { useToast } from "@/providers";
import type { Ingredient, NutritionGroup } from "@repo/schemas";
import { useTransition } from "react";

import { deleteIngredient } from "../actions/deleteIngredient";
import { INGREDIENT_MESSAGES } from "../constants";
import { ingredientDefaultValues, useIngredientForm } from "./useIngredientForm";
import { useIngredientsFilters } from "./useIngredientsFilters";
import { useIngredientsPagination } from "./useIngredientsPagination";
import { useIngredientsUI } from "./useIngredientsUI";

type IngredientsPageContentProps = {
  ingredientGroups: NutritionGroup[];
  ingredients: Ingredient[];
  ingredientsCount: number;
};

/**
 * Central hook that orchestrates all ingredients page logic
 */
export const useIngredientsPageLogic = (props: IngredientsPageContentProps) => {
  const { ingredientGroups } = props;
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const pagination = useIngredientsPagination();
  const filters = useIngredientsFilters(ingredientGroups);
  const ui = useIngredientsUI();
  const form = useIngredientForm();

  /**
   * Generic async action handler with consistent error handling
   */
  const handleAsyncAction = async (
    action: () => Promise<unknown>,
    successMessage: string,
    onComplete?: () => void,
  ) => {
    try {
      await action();
      toast.success(successMessage);
      onComplete?.();
    } catch (error) {
      toast.error(INGREDIENT_MESSAGES.DELETE_ERROR((error as Error).message));
    } finally {
      // Always close dialog regardless of success/failure
      ui.closeDeleteDialog();
    }
  };

  const handleDeleteIngredient = () => {
    if (!ui.ingredientToDelete) return;

    const { id, name } = ui.ingredientToDelete;

    // Use transition for better UX during deletion
    startTransition(() => {
      handleAsyncAction(() => deleteIngredient(id), INGREDIENT_MESSAGES.DELETE_SUCCESS(name));
    });
  };

  const resetForm = (ingredient?: Ingredient) => {
    form.reset(ingredient ?? ingredientDefaultValues);
  };

  const handleOpenDrawer = (ingredient?: Ingredient) => {
    resetForm(ingredient);
    ui.openDrawer();
  };

  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    pagination.onPageChange(page);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newLimit = Number(event.target.value);
    pagination.onParamsChange([{ param: "limit", value: newLimit }]);
  };

  return {
    isPending,
    pagination,
    filters,
    ui,
    form,
    handlers: {
      handleDeleteIngredient,
      handleOpenDrawer,
      handlePageChange,
      handleRowsPerPageChange,
    },
  };
};
