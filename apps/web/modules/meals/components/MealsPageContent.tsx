"use client";

import {
  ConfirmActionDialog,
  CountIndicator,
  EmptyState,
  MultiSelect,
  SearchField,
} from "@/components";
import { useToast } from "@/providers";
import { Button, Stack, TablePagination, Toolbar } from "@mui/material";
import type { Ingredient, Meal, MealTag } from "@repo/schemas";
import { useTransition } from "react";

import { Add, FilterList } from "@mui/icons-material";
import { deleteMeal } from "../actions/deleteMeal";
import { useMealsFilters } from "../hooks/useMealsFilters";
import { useMealsPagination } from "../hooks/useMealsPagination";
import { useMealsUI } from "../hooks/useMealsUI";
import { MealDrawer } from "./MealDrawer";
import { MealsTable } from "./MealsTable";

type MealsPageContentProps = {
  ingredients: Ingredient[];
  meals: Meal[];
  mealTags: MealTag[];
  total: number;
};

export function MealsPageContent({ ingredients, meals, mealTags, total }: MealsPageContentProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const { limitParam, onPageChange, onParamsChange, onSearchChange, page } = useMealsPagination();

  const {
    currentFilters: { order, orderBy, search },
    handleSortChange,
    handleTagChange,
    handleClearFilters,
    selectedTagIds,
  } = useMealsFilters(mealTags);

  const {
    closeConfirmDialog,
    closeDrawer,
    drawerState,
    mealToDelete,
    openDrawer,
    setMealToDelete,
  } = useMealsUI();

  const handleDeleteMeal = () => {
    if (mealToDelete) {
      startTransition(() => {
        deleteMeal(mealToDelete.id)
          .then(() => {
            toast.success(`Meal ${mealToDelete.name} removed successfully`);
            closeConfirmDialog();
          })
          .catch((error) => {
            toast.error(`Failed to remove meal: ${error.message}`);
            closeConfirmDialog();
          });
      });
    }
  };

  // Check if any filters are active
  const hasActiveFilters =
    search.trim() !== "" || (selectedTagIds.length > 0 && selectedTagIds.length < mealTags.length);

  // Determine empty state content
  const getEmptyStateContent = () => {
    if (hasActiveFilters) {
      return {
        title: "No meals found",
        subtitle:
          search?.trim() !== ""
            ? `No meals match "${search?.trim()}"`
            : "No meals found with current filters",
        action: (
          <Button variant="outlined" startIcon={<FilterList />} onClick={handleClearFilters}>
            Clear Filters
          </Button>
        ),
      };
    }

    return {
      title: "No meals found",
      subtitle: "Please add some meals to your list",
      action: (
        <Button variant="outlined" startIcon={<Add />} onClick={() => openDrawer(null)}>
          Add Meal
        </Button>
      ),
    };
  };

  const emptyStateContent = getEmptyStateContent();

  return (
    <>
      <Toolbar sx={{ mb: 2 }}>
        <Stack alignItems="center" direction="row" spacing={2}>
          <MultiSelect
            label="Meal tags"
            options={mealTags}
            value={selectedTagIds}
            onChange={handleTagChange}
            size="small"
            sx={{ minWidth: 200, maxWidth: 300 }}
          />
          <CountIndicator end={total} />
        </Stack>

        <Stack alignItems="center" direction="row" spacing={2} sx={{ ml: "auto" }}>
          <SearchField onChange={onSearchChange} value={search} />
          <Button
            aria-label="Add new meal"
            onClick={() => openDrawer()}
            variant="contained"
            size="small"
            startIcon={<Add />}
          >
            Add Meal
          </Button>
        </Stack>
      </Toolbar>

      {meals.length === 0 ? (
        <EmptyState
          title={emptyStateContent.title}
          subtitle={emptyStateContent.subtitle}
          action={emptyStateContent.action}
        />
      ) : (
        <MealsTable
          meals={meals}
          onRowClick={(meal) => openDrawer(meal)}
          onSort={handleSortChange}
          order={order}
          orderBy={orderBy}
          setMealToDelete={setMealToDelete}
        />
      )}

      {meals.length > 0 && (
        <TablePagination
          component="div"
          count={total}
          onPageChange={(_event, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(e) => onParamsChange([{ param: "limit", value: +e.target.value }])}
          page={page}
          rowsPerPage={limitParam}
        />
      )}

      <MealDrawer
        ingredients={ingredients}
        meal={drawerState.meal}
        mealTags={mealTags}
        onClose={closeDrawer}
        open={drawerState.open}
      />

      <ConfirmActionDialog
        description={`Are you sure you want to remove ${mealToDelete?.name ?? "this meal"}?`}
        handleClose={closeConfirmDialog}
        loading={isPending}
        onConfirm={handleDeleteMeal}
        open={Boolean(mealToDelete)}
      />
    </>
  );
}
