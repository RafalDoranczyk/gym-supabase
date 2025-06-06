"use client";

import { ConfirmActionDialog } from "@/components";
import { Box, TablePagination } from "@mui/material";
import type { Ingredient, IngredientGroup } from "@repo/schemas";

import { useIngredientsPageLogic } from "../hooks/useIngredientsPageLogic";
import { IngredientDrawer } from "./IngredientDrawer";
import { IngredientsEmptyState } from "./IngredientsEmptyState";
import { IngredientsTable } from "./IngredientsTable";
import { IngredientsToolbar } from "./IngredientsToolbar";

type IngredientsPageContentProps = {
  ingredientGroups: IngredientGroup[];
  ingredients: Ingredient[];
  ingredientsCount: number;
};

export function IngredientsPageContent(props: IngredientsPageContentProps) {
  const { ingredients, ingredientsCount, ingredientGroups } = props;
  const { isPending, pagination, filters, ui, form, handlers } = useIngredientsPageLogic(props);

  // Pagination
  const { limitParam, page, onSearchChange, onClearAllFilters } = pagination;

  // UI state
  const { drawerOpen, ingredientToDelete, setDeleteIngredient, closeDeleteDialog, closeDrawer } =
    ui;

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
  } as const;

  const tableProps = {
    ingredients,
    onRowClick: handleOpenDrawer,
    onSort: handleSortChange,
    order,
    orderBy,
    setIngredientToDelete: setDeleteIngredient,
  } as const;

  const hasIngredients = ingredients.length > 0;

  return (
    <Box>
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

      <IngredientDrawer
        form={form}
        ingredientGroups={ingredientGroups}
        onClose={closeDrawer}
        open={drawerOpen}
      />

      <ConfirmActionDialog
        description={`Are you sure you want to remove ${ingredientToDelete?.name ?? "this ingredient"}?`}
        handleClose={closeDeleteDialog}
        loading={isPending}
        onConfirm={handleDeleteIngredient}
        open={Boolean(ingredientToDelete)}
      />
    </Box>
  );
}
