"use client";

import type { NutritionGroup } from "@repo/schemas";
import { useCallback, useState } from "react";

export function useIngredientGroupUI() {
  const [groupToDelete, setGroupToDelete] = useState<NutritionGroup | null>(null);
  const [editDialogState, setEditDialogState] = useState<{
    group: NutritionGroup | null;
    open: boolean;
  }>({
    group: null,
    open: false,
  });

  const handleEdit = useCallback((group: NutritionGroup) => {
    setEditDialogState({ group, open: true });
  }, []);

  const handleDeleteClick = useCallback((group: NutritionGroup) => {
    setGroupToDelete(group);
  }, []);

  // Dialog management
  const closeConfirmDialog = useCallback(() => {
    setGroupToDelete(null);
  }, []);

  const closeEditDialog = useCallback(() => {
    setEditDialogState({ group: null, open: false });
  }, []);

  const openCreateDialog = useCallback(() => {
    setEditDialogState({ group: null, open: true });
  }, []);

  return {
    // State
    groupToDelete,
    editDialogState,
    // Business logic handlers
    handleEdit,
    handleDeleteClick,
    closeConfirmDialog,
    closeEditDialog,
    openCreateDialog,
  };
}
