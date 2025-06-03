"use client";

import { ConfirmActionDialog } from "@/components";
import { useToast } from "@/providers";
import { TablePagination } from "@mui/material";
import type { Ingredient, NutritionGroup } from "@repo/schemas";
import { useTransition } from "react";

import { deleteIngredient } from "../actions/deleteIngredient";
import { useIngredientsFilters } from "../hooks/useIngredientsFilters";
import { useIngredientsPagination } from "../hooks/useIngredientsPagination";
import { useIngredientsUI } from "../hooks/useIngredientsUI";

import { ingredientDefaultValues, useIngredientForm } from "../hooks/useIngredientForm";
import { IngredientDrawer } from "./IngredientDrawer";
import { IngredientsEmptyState } from "./IngredientsEmptyState";
import { IngredientsTable } from "./IngredientsTable";
import { IngredientsToolbar } from "./IngredientsToolbar";

type IngredientsPageOverviewProps = {
  ingredientGroups: NutritionGroup[];
  ingredients: Ingredient[];
  ingredientsCount: number;
};

export function IngredientsPageOverview({
  ingredientGroups,
  ingredients,
  ingredientsCount,
}: IngredientsPageOverviewProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const { limitParam, onPageChange, onParamsChange, onSearchChange, page } =
    useIngredientsPagination();

  const {
    activeOptions,
    currentFilters: { group, order, orderBy, search },
    handleGroupChange,
    handleSortChange,
    handleClearFilters,
  } = useIngredientsFilters(ingredientGroups);

  const {
    drawer,
    openDrawer,
    closeDrawer,
    ingredientToDelete,
    setDeleteIngredient,
    closeDeleteDialog,
  } = useIngredientsUI();

  const form = useIngredientForm();

  const handleDeleteIngredient = () => {
    if (ingredientToDelete) {
      startTransition(() => {
        deleteIngredient(ingredientToDelete.id)
          .then(() => {
            toast.success(`Ingredient ${ingredientToDelete.name} removed successfully`);
            closeDeleteDialog();
          })
          .catch((error) => {
            toast.error(`Failed to remove ingredient: ${error.message}`);
            closeDeleteDialog();
          });
      });
    }
  };

  const handleOpenDrawer = (ingredient?: Ingredient) => {
    if (ingredient) {
      form.reset(ingredient);
    } else {
      form.reset(ingredientDefaultValues);
    }
    openDrawer();
  };

  // Check if any filters are active
  const hasActiveFilters = search?.trim() !== "" || group !== "All";

  return (
    <>
      <IngredientsToolbar
        activeOptions={activeOptions}
        group={group}
        ingredientsCount={ingredientsCount}
        onSearchChange={onSearchChange}
        openDrawer={handleOpenDrawer}
        search={search}
        handleGroupChange={handleGroupChange}
      />
      {ingredients.length === 0 ? (
        <IngredientsEmptyState
          hasActiveFilters={hasActiveFilters}
          search={search}
          onClearFilters={handleClearFilters}
          onAddIngredient={handleOpenDrawer}
        />
      ) : (
        <IngredientsTable
          ingredients={ingredients}
          onRowClick={handleOpenDrawer}
          onSort={handleSortChange}
          order={order}
          orderBy={orderBy}
          setIngredientToDelete={setDeleteIngredient}
        />
      )}

      {ingredients.length > 0 && (
        <TablePagination
          component="div"
          count={ingredientsCount}
          onPageChange={(_event, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(e) => onParamsChange([{ param: "limit", value: +e.target.value }])}
          page={page}
          rowsPerPage={limitParam}
        />
      )}

      <IngredientDrawer
        form={form}
        ingredientGroups={ingredientGroups}
        onClose={closeDrawer}
        open={drawer.open}
      />

      <ConfirmActionDialog
        description={`Are you sure you want to remove ${ingredientToDelete?.name ?? "this ingredient"}?`}
        handleClose={closeDeleteDialog}
        loading={isPending}
        onConfirm={handleDeleteIngredient}
        open={Boolean(ingredientToDelete)}
      />
    </>
  );
}
