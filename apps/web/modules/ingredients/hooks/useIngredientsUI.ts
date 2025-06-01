"use client";

import type { Ingredient } from "@repo/schemas";
import { useCallback, useState } from "react";

export function useIngredientsUI() {
  const [deleteIngredient, setDeleteIngredient] = useState<Ingredient | null>(null);
  const [drawer, setDrawer] = useState<{
    ingredient: Ingredient | null;
    open: boolean;
  }>({
    ingredient: null,
    open: false,
  });

  const closeDeleteDialog = useCallback(() => {
    setDeleteIngredient(null);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer({ ingredient: null, open: false });
  }, []);

  const openDrawer = useCallback((ingredient: Ingredient | null = null) => {
    setDrawer({ ingredient, open: true });
  }, []);

  return {
    // State
    deleteIngredient,
    drawer,

    // Actions
    closeDeleteDialog,
    closeDrawer,
    openDrawer,
    setDeleteIngredient,
  };
}
