"use client";

import type { MealTag } from "@repo/schemas";
import { useCallback, useState } from "react";

export function useMealTagsUI() {
  const [tagToDelete, setTagToDelete] = useState<MealTag | null>(null);
  const [editDialogState, setEditDialogState] = useState<{
    tag: MealTag | null;
    open: boolean;
  }>({
    tag: null,
    open: false,
  });

  const handleEdit = useCallback((tag: MealTag) => {
    setEditDialogState({ tag, open: true });
  }, []);

  const handleDeleteClick = useCallback((tag: MealTag) => {
    setTagToDelete(tag);
  }, []);

  // Dialog management
  const closeConfirmDialog = useCallback(() => {
    setTagToDelete(null);
  }, []);

  const closeEditDialog = useCallback(() => {
    setEditDialogState({ tag: null, open: false });
  }, []);

  const openCreateDialog = useCallback(() => {
    setEditDialogState({ tag: null, open: true });
  }, []);

  return {
    // State
    tagToDelete,
    editDialogState,
    // Business logic handlers
    handleEdit,
    handleDeleteClick,
    closeConfirmDialog,
    closeEditDialog,
    openCreateDialog,
  };
}
