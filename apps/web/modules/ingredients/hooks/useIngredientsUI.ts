"use client";

import type { Ingredient } from "@repo/schemas";
import { useCallback, useState } from "react";

export function useIngredientsUI() {
  const [ingredientToRemove, setIngredientToRemove] = useState<Ingredient | null>(null);
  const [drawerState, setDrawerState] = useState<{
    ingredient: Ingredient | null;
    open: boolean;
  }>({
    ingredient: null,
    open: false,
  });

  const closeConfirmDialog = useCallback(() => {
    setIngredientToRemove(null);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerState({ ingredient: null, open: false });
  }, []);

  const openDrawer = useCallback((ingredient: Ingredient | null = null) => {
    setDrawerState({ ingredient, open: true });
  }, []);

  return {
    closeConfirmDialog,
    closeDrawer,
    drawerState,
    ingredientToRemove,
    openDrawer,
    setIngredientToRemove,
  };
}
