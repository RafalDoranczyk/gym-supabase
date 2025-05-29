"use client";

import { ConfirmActionDialog, CountIndicator, SearchField, SelectMenu } from "@/components";
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

type IngredientsPageOverviewProps = {
  ingredientGroups: NutritionGroup[];
  ingredients: Ingredient[];
  total: number;
};

export function IngredientsPageOverview({
  ingredientGroups,
  ingredients,
  total,
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
  } = useIngredientsFilters(ingredientGroups);

  const {
    closeConfirmDialog,
    closeDrawer,
    drawerState,
    ingredientToRemove,
    openDrawer,
    setIngredientToRemove,
  } = useIngredientsUI();

  const handleRemoveIngredient = () => {
    if (ingredientToRemove) {
      startTransition(() => {
        deleteIngredient(ingredientToRemove.id)
          .then(() => {
            toast.success(`Ingredient ${ingredientToRemove.name} removed successfully`);
            closeConfirmDialog();
          })
          .catch((error) => {
            toast.error(`Failed to remove ingredient: ${error.message}`);
            closeConfirmDialog();
          });
      });
    }
  };

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
          <CountIndicator end={total} />
          <SearchField onChange={onSearchChange} value={search} />
        </Stack>

        <Button
          color="secondary"
          onClick={() => openDrawer()}
          sx={{ ml: "auto" }}
          variant="contained"
        >
          Add Ingredient
        </Button>
      </Toolbar>

      <IngredientsTable
        ingredients={ingredients}
        onRowClick={(ingredient) => openDrawer(ingredient)}
        onSort={handleSortChange}
        order={order}
        orderBy={orderBy}
        setIngredientToRemove={setIngredientToRemove}
      />

      {ingredients.length > 0 && (
        <TablePagination
          component="div"
          count={total}
          onPageChange={(_event, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(e) => onParamsChange([{ param: "limit", value: +e.target.value }])}
          page={page}
          rowsPerPage={limitParam}
        />
      )}

      <IngredientDrawer
        ingredient={drawerState.ingredient}
        ingredientGroups={ingredientGroups}
        onClose={closeDrawer}
        open={drawerState.open}
      />

      <ConfirmActionDialog
        description={`Are you sure you want to remove ${ingredientToRemove?.name ?? "this ingredient"}?`}
        handleClose={closeConfirmDialog}
        loading={isPending}
        onConfirm={handleRemoveIngredient}
        open={Boolean(ingredientToRemove)}
      />
    </>
  );
}
