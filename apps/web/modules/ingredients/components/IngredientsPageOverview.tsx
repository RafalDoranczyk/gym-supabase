"use client";

import {
  ConfirmActionDialog,
  CountIndicator,
  EmptyState,
  SearchField,
  SelectMenu,
} from "@/components";
import { useToast } from "@/providers";
import { Button, Stack, TablePagination, Toolbar } from "@mui/material";
import type { Ingredient, NutritionGroup } from "@repo/schemas";
import { useTransition } from "react";

import { deleteIngredient } from "../actions/deleteIngredient";
import { useIngredientsFilters } from "../hooks/useIngredientsFilters";
import { useIngredientsPagination } from "../hooks/useIngredientsPagination";
import { useIngredientsUI } from "../hooks/useIngredientsUI";
import { IngredientDrawer } from "./IngredientDrawer";
import { IngredientsTable } from "./IngredientsTable";
import { Add, FilterList } from "@mui/icons-material";

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
    closeDeleteDialog,
    closeDrawer,
    deleteIngredient: ingredientToDelete,
    drawer,
    openDrawer,
    setDeleteIngredient,
  } = useIngredientsUI();

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

  // Check if any filters are active
  const hasActiveFilters = search?.trim() !== "" || group !== "All";

  // Determine empty state content
  const getEmptyStateContent = () => {
    if (hasActiveFilters) {
      return {
        title: "No ingredients found",
        subtitle:
          search?.trim() !== ""
            ? `No ingredients match "${search?.trim()}"`
            : "No ingredients found with current filters",
        action: (
          <Button variant="outlined" startIcon={<FilterList />} onClick={handleClearFilters}>
            Clear Filters
          </Button>
        ),
      };
    }

    return {
      title: "No ingredients found",
      subtitle: "Please add some ingredients to your list",
      action: (
        <Button variant="outlined" startIcon={<Add />} onClick={() => openDrawer(null)}>
          Add Ingredient
        </Button>
      ),
    };
  };

  const emptyStateContent = getEmptyStateContent();

  return (
    <>
      <Toolbar sx={{ mb: 2 }}>
        <Stack alignItems="center" direction="row" spacing={2}>
          <SelectMenu
            activeOption={group}
            id="ingredients-filter-menu"
            options={activeOptions}
            setActiveOption={handleGroupChange}
          />
          <CountIndicator end={ingredientsCount} />
        </Stack>

        <Stack alignItems="center" direction="row" spacing={2} sx={{ ml: "auto" }}>
          <SearchField onChange={onSearchChange} value={search} />
          <Button
            aria-label="Add new ingredient"
            onClick={() => openDrawer()}
            variant="contained"
            size="small"
            startIcon={<Add />}
          >
            Add Ingredient
          </Button>
        </Stack>
      </Toolbar>

      {ingredients.length === 0 ? (
        <EmptyState
          title={emptyStateContent.title}
          subtitle={emptyStateContent.subtitle}
          action={emptyStateContent.action}
        />
      ) : (
        <IngredientsTable
          ingredients={ingredients}
          onRowClick={(ingredient) => openDrawer(ingredient)}
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
        ingredient={drawer.ingredient}
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
