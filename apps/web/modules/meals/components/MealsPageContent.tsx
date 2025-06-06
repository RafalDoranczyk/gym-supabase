"use client";

import {
  ConfirmActionDialog,
  CountIndicator,
  EmptyState,
  MultiSelect,
  SearchFieldURL,
} from "@/components";
import { useToast } from "@/providers";
import { Button, Stack, TablePagination, Toolbar } from "@mui/material";
import type { Ingredient, Meal, MealTag } from "@repo/schemas";
import { useMemo, useTransition } from "react";

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

  // Hooks for state management
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

  // Computed values
  const hasActiveFilters = useMemo(
    () =>
      search.trim() !== "" ||
      (selectedTagIds.length > 0 && selectedTagIds.length < mealTags.length),
    [search, selectedTagIds.length, mealTags.length]
  );

  const hasMeals = meals.length > 0;

  const emptyStateContent = useMemo(() => {
    if (hasActiveFilters) {
      const trimmedSearch = search?.trim();
      return {
        title: "No meals found",
        subtitle: trimmedSearch
          ? `No meals match "${trimmedSearch}"`
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
        <Button variant="outlined" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Meal
        </Button>
      ),
    };
  }, [hasActiveFilters, search, handleClearFilters]);

  // Dialog handlers
  const handleOpenDialog = (meal?: Meal | null) => {
    openDrawer(meal ?? null);
  };

  const handleCloseDialog = () => {
    closeDrawer();
  };

  // Delete handlers
  const handleOpenDeleteDialog = (meal: Meal) => {
    setMealToDelete(meal);
  };

  const handleCloseDeleteDialog = () => {
    closeConfirmDialog();
  };

  const handleConfirmDelete = () => {
    if (!mealToDelete) return;

    startTransition(async () => {
      try {
        await deleteMeal({ id: mealToDelete.id });
        toast.success(`Meal "${mealToDelete.name}" removed successfully`);
        handleCloseDeleteDialog();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Failed to remove meal: ${errorMessage}`);
        handleCloseDeleteDialog();
      }
    });
  };

  // Table handlers
  const handleRowClick = (meal: Meal) => {
    handleOpenDialog(meal);
  };

  // Pagination handlers
  const handlePageChange = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onParamsChange([{ param: "limit", value: Number(event.target.value) }]);
  };

  return (
    <>
      {/* Toolbar with filters and actions */}
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
          <SearchFieldURL onChange={onSearchChange} value={search} placeholder="Search meals..." />
          <Button
            aria-label="Add new meal"
            onClick={() => handleOpenDialog()}
            variant="contained"
            size="small"
            startIcon={<Add />}
          >
            Add Meal
          </Button>
        </Stack>
      </Toolbar>

      {/* Main content area */}
      {!hasMeals ? (
        <EmptyState
          title={emptyStateContent.title}
          subtitle={emptyStateContent.subtitle}
          action={emptyStateContent.action}
        />
      ) : (
        <MealsTable
          meals={meals}
          onRowClick={handleRowClick}
          onSort={handleSortChange}
          order={order}
          orderBy={orderBy}
          setMealToDelete={handleOpenDeleteDialog}
        />
      )}

      {/* Pagination - only show when there are meals */}
      {hasMeals && (
        <TablePagination
          component="div"
          count={total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page}
          rowsPerPage={limitParam}
          rowsPerPageOptions={[5, 10, 25, 50]}
          showFirstButton
          showLastButton
        />
      )}

      {/* Drawer for adding/editing meals */}
      <MealDrawer
        ingredients={ingredients}
        meal={drawerState.meal}
        mealTags={mealTags}
        onClose={handleCloseDialog}
        open={drawerState.open}
      />

      {/* Confirmation dialog for deletion */}
      <ConfirmActionDialog
        title="Delete Meal"
        description={
          mealToDelete
            ? `Are you sure you want to remove "${mealToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to remove this meal?"
        }
        handleClose={handleCloseDeleteDialog}
        loading={isPending}
        onConfirm={handleConfirmDelete}
        open={Boolean(mealToDelete)}
      />
    </>
  );
}
