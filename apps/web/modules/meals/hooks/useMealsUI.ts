"use client";

import type { Meal } from "@repo/schemas";
import { useCallback, useState } from "react";

export function useMealsUI() {
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);
  const [drawerState, setDrawerState] = useState<{
    meal: Meal | null;
    open: boolean;
  }>({
    meal: null,
    open: false,
  });

  const closeConfirmDialog = useCallback(() => {
    setMealToDelete(null);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerState({ meal: null, open: false });
  }, []);

  const openDrawer = useCallback((meal: Meal | null = null) => {
    setDrawerState({ meal, open: true });
  }, []);

  return {
    closeConfirmDialog,
    closeDrawer,
    drawerState,
    mealToDelete,
    openDrawer,
    setMealToDelete,
  };
}
