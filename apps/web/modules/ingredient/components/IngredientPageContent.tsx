"use client";

import { ConfirmActionDialog, ListToolbar, SearchableEmptyState } from "@/components";
import { AppError } from "@/core";
import type { IngredientGroup } from "@/modules/ingredient-group";
import { useToast } from "@/providers";
import { useState, useTransition } from "react";
import { deleteIngredient } from "../actions/deleteIngredient";
import { useIngredientFilters } from "../hooks/useIngredientFilters";
import { ingredientDefaultValues, useIngredientForm } from "../hooks/useIngredientForm";
import type { Ingredient } from "../schemas";
import { IngredientDrawer } from "./IngredientDrawer";
import { IngredientTable } from "./IngredientTable";

type IngredientPageContentProps = {
  ingredientGroups: IngredientGroup[];
  ingredients: Ingredient[];
  ingredientsCount: number;
};

export function IngredientPageContent({
  ingredients,
  ingredientsCount,
  ingredientGroups,
}: IngredientPageContentProps) {
  // ✅ UI state directly in component
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);

  // ✅ UI state handlers
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const closeDeleteDialog = () => setIngredientToDelete(null);

  // ✅ Hooks
  const filters = useIngredientFilters(ingredientGroups);
  const form = useIngredientForm();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // ✅ Business logic handlers
  const handleDeleteIngredient = () => {
    if (!ingredientToDelete) return;

    const { id, name } = ingredientToDelete;

    startTransition(async () => {
      try {
        await deleteIngredient({ id });
        toast.success(`Ingredient "${name}" removed successfully`);
      } catch (error) {
        const message = error instanceof AppError ? error.message : "Unknown error";
        toast.error(`Failed to remove ingredient: ${message}`);
      } finally {
        closeDeleteDialog();
      }
    });
  };

  const handleOpenDrawer = (ingredient?: Ingredient) => {
    form.reset(ingredient ?? ingredientDefaultValues);
    openDrawer();
  };

  // ✅ Computed values
  const hasIngredients = ingredients.length > 0;

  // ✅ Props objects for better organization
  const listToolbarProps = {
    filterType: "dropdown" as const,
    filterLabel: "Group",
    selectedValue: filters.currentFilters.group,
    options: filters.activeOptions,
    onFilterChange: filters.handleGroupChange,
    search: filters.currentFilters.search,
    onSearchChange: filters.handleSearchChange,
    onAdd: handleOpenDrawer,
    addButtonText: "Add Ingredient",
    addButtonAriaLabel: "Add new ingredient",
    count: ingredientsCount,
  } as const;

  const tableProps = {
    ingredients,
    onRowClick: handleOpenDrawer,
    onSort: filters.handleSortChange,
    order: filters.currentFilters.order,
    orderBy: filters.currentFilters.orderBy,
    setIngredientToDelete,
    count: ingredientsCount,
  } as const;

  const emptyStateProps = {
    hasActiveFilters: filters.hasActiveFilters,
    search: filters.currentFilters.search,
    onClearFilters: filters.handleClearAllFilters,
    onAdd: handleOpenDrawer,
    config: {
      entityName: "ingredients",
      entityNameSingular: "ingredient",
      addButtonText: "Add Ingredient",
      organizeText: "building your ingredients list",
    },
  } as const;

  const confirmDialogProps = {
    title: "Delete Ingredient",
    description: `Are you sure you want to remove ${ingredientToDelete?.name ?? "this ingredient"}? This action cannot be undone.`,
    onClose: closeDeleteDialog,
    loading: isPending,
    onConfirm: handleDeleteIngredient,
    open: Boolean(ingredientToDelete),
  } as const;

  const drawerProps = {
    form,
    ingredientGroups,
    onClose: closeDrawer,
    open: drawerOpen,
  } as const;

  return (
    <div>
      <ListToolbar {...listToolbarProps} />

      {hasIngredients ? (
        <IngredientTable {...tableProps} />
      ) : (
        <SearchableEmptyState {...emptyStateProps} />
      )}
      <IngredientDrawer {...drawerProps} />
      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
