import type { Ingredient } from "@repo/schemas";
import { useState } from "react";

export function useIngredientsUI() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const setDeleteIngredient = (ingredient: Ingredient) => {
    setIngredientToDelete(ingredient);
  };

  const closeDeleteDialog = () => {
    setIngredientToDelete(null);
  };

  return {
    drawerOpen,
    openDrawer,
    closeDrawer,
    ingredientToDelete,
    setDeleteIngredient,
    closeDeleteDialog,
  };
}
