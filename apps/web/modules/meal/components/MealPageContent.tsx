"use client";

import { ConfirmActionDialog, ListToolbar, SearchableEmptyState } from "@/components";
import { AppError } from "@/core";
import type { Ingredient } from "@/modules/ingredient";
import type { MealTag } from "@/modules/meal-tag";
import { useToast } from "@/providers";
import { useState, useTransition } from "react";
import { deleteMeal } from "../actions/deleteMeal";
import { mealDefaultValues, useMealForm } from "../hooks/useMealForm";
import { useMealsFilters } from "../hooks/useMealsFilters";
import type { Meal } from "../schemas";
import { MealDrawer } from "./MealDrawer";
import { MealTable } from "./MealTable";

type MealPageContentProps = {
  ingredients: Ingredient[];
  meals: Meal[];
  mealTags: MealTag[];
  mealsCount: number;
};

export function MealPageContent({
  meals,
  mealsCount,
  mealTags,
  ingredients,
}: MealPageContentProps) {
  // ✅ UI state directly in component
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);

  // ✅ UI state handlers
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const closeDeleteDialog = () => setMealToDelete(null);

  // ✅ Hooks
  const filters = useMealsFilters(mealTags);
  const form = useMealForm();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // ✅ Business logic handlers
  const handleDeleteMeal = () => {
    if (!mealToDelete) return;

    const { id, name } = mealToDelete;

    startTransition(async () => {
      try {
        await deleteMeal({ id });
        toast.success(`Meal "${name}" removed successfully`);
      } catch (error) {
        const message = error instanceof AppError ? error.message : "Unknown error";
        toast.error(`Failed to remove meal: ${message}`);
      } finally {
        closeDeleteDialog();
      }
    });
  };

  const handleOpenDrawer = (meal?: Meal) => {
    form.reset(meal ?? mealDefaultValues);
    openDrawer();
  };

  // ✅ Computed values
  const hasMeals = meals.length > 0;

  // ✅ Props objects for better organization
  const listToolbarProps = {
    filterType: "multiselect" as const,
    filterLabel: "Meal tags",
    selectedValues: filters.selectedTagIds,
    options: filters.activeOptions,
    onFilterChange: filters.handleTagChange,
    search: filters.currentFilters.search,
    onSearchChange: filters.handleSearchChange,
    onAdd: handleOpenDrawer,
    addButtonText: "Add Meal",
    addButtonAriaLabel: "Add new meal",
    count: mealsCount,
  } as const;

  const tableProps = {
    meals,
    onRowClick: handleOpenDrawer,
    onSort: filters.handleSortChange,
    order: filters.currentFilters.order,
    orderBy: filters.currentFilters.orderBy,
    setMealToDelete,
    count: mealsCount,
  } as const;

  const emptyStateProps = {
    hasActiveFilters: filters.hasActiveFilters,
    search: filters.currentFilters.search,
    onClearFilters: filters.handleClearAllFilters,
    onAdd: handleOpenDrawer,
    config: {
      entityName: "meals",
      entityNameSingular: "meal",
      addButtonText: "Add Meal",
      organizeText: "building your meals list",
    },
  } as const;

  const confirmDialogProps = {
    title: "Delete Meal",
    description: `Are you sure you want to remove ${mealToDelete?.name ?? "this meal"}? This action cannot be undone.`,
    onClose: closeDeleteDialog,
    loading: isPending,
    onConfirm: handleDeleteMeal,
    open: Boolean(mealToDelete),
  } as const;

  const drawerProps = {
    form,
    ingredients,
    mealTags,
    onClose: closeDrawer,
    open: drawerOpen,
  } as const;

  return (
    <div>
      <ListToolbar {...listToolbarProps} />
      {hasMeals ? <MealTable {...tableProps} /> : <SearchableEmptyState {...emptyStateProps} />}
      <MealDrawer {...drawerProps} />
      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
