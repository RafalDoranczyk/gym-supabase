"use client";

import { ConfirmActionDialog } from "@/components";
import { TablePagination } from "@mui/material";
import type { Ingredient, NutritionGroup } from "@repo/schemas";

import { INGREDIENT_MESSAGES } from "../constants";
import { useIngredientsPageLogic } from "../hooks/useIngredientsPageLogic";
import { IngredientDrawer } from "./IngredientDrawer";
import { IngredientsEmptyState } from "./IngredientsEmptyState";
import { IngredientsTable } from "./IngredientsTable";
import { IngredientsToolbar } from "./IngredientsToolbar";

type IngredientsPageContentProps = {
  ingredientGroups: NutritionGroup[];
  ingredients: Ingredient[];
  ingredientsCount: number;
};

export function IngredientsPageContent(props: IngredientsPageContentProps) {
  const { ingredients, ingredientsCount, ingredientGroups } = props;

  const { isPending, pagination, filters, ui, form, handlers } = useIngredientsPageLogic(props);

  const { limitParam, page, onSearchChange, onClearAllFilters } = pagination;

  // UI state
  const { drawer, ingredientToDelete, setDeleteIngredient, closeDeleteDialog } = ui;

  // Handlers
  const { handleDeleteIngredient, handleOpenDrawer, handlePageChange, handleRowsPerPageChange } =
    handlers;

  // Filters
  const {
    activeOptions,
    currentFilters: { group, order, orderBy, search },
    handleGroupChange,
    handleSortChange,
    hasActiveFilters,
  } = filters;

  // Complex props worth extracting for readability
  const toolbarProps = {
    filters: { group, search, activeOptions },
    actions: {
      onSearchChange,
      openDrawer: handleOpenDrawer,
      handleGroupChange,
    },
    ingredientsCount,
  };

  const tableProps = {
    ingredients,
    onRowClick: handleOpenDrawer,
    onSort: handleSortChange,
    order,
    orderBy,
    setIngredientToDelete: setDeleteIngredient,
  };

  const hasIngredients = ingredients.length > 0;

  return (
    <>
      <IngredientsToolbar {...toolbarProps} />

      {/* Conditional rendering based on ingredients availability */}
      {!hasIngredients && (
        <IngredientsEmptyState
          hasActiveFilters={hasActiveFilters}
          search={search}
          onClearFilters={onClearAllFilters}
          onAddIngredient={handleOpenDrawer}
        />
      )}

      {hasIngredients && (
        <>
          <IngredientsTable {...tableProps} />
          <TablePagination
            component="div"
            count={ingredientsCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page}
            rowsPerPage={limitParam}
          />
        </>
      )}

      {/* Always present UI elements */}
      <IngredientDrawer
        form={form}
        ingredientGroups={ingredientGroups}
        onClose={ui.closeDrawer}
        open={drawer.open}
      />

      <ConfirmActionDialog
        description={INGREDIENT_MESSAGES.CONFIRM_DELETE(ingredientToDelete?.name)}
        handleClose={closeDeleteDialog}
        loading={isPending}
        onConfirm={handleDeleteIngredient}
        open={Boolean(ingredientToDelete)}
      />
    </>
  );
}
