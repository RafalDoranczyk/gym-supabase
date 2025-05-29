"use client";

import { ConfirmActionDialog, CountIndicator, SearchField } from "@/components";
import { useToast } from "@/providers";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TablePagination,
  Toolbar,
} from "@mui/material";
import type { Ingredient, Meal, MealTag } from "@repo/schemas";
import { useTransition } from "react";

import { useMealsFilters } from "../hooks/useMealsFilters";
import { useMealsPagination } from "../hooks/useMealsPagination";
import { useMealsUI } from "../hooks/useMealsUI";
import { MealDrawer } from "./MealDrawer";
import { MealsTable } from "./MealsTable";

type MealsPageOverviewProps = {
  ingredients: Ingredient[];
  meals: Meal[];
  mealTags: MealTag[];
  total: number;
};

export function MealsPageOverview({ ingredients, meals, mealTags, total }: MealsPageOverviewProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const { limitParam, onPageChange, onParamsChange, onSearchChange, page } = useMealsPagination();

  const {
    activeOptions,
    currentFilters: { order, orderBy, search, tag },
    handleSortChange,
    handleTagChange,
    isAllSelected,
    selectedTagIds,
  } = useMealsFilters(mealTags);

  const {
    closeConfirmDialog,
    closeDrawer,
    drawerState,
    mealToRemove,
    openDrawer,
    setMealToRemove,
  } = useMealsUI();

  const onRowClick = (meal: Meal) => {};

  const handleRemoveMeal = async () => {
    // if (mealToRemove) {
    //   startTransition(() => {
    //     deleteIngredient(mealToRemove.id)
    //       .then(() => {
    //         toast.success(`Meal ${mealToRemove.name} removed successfully`);
    //         closeConfirmDialog();
    //       })
    //       .catch(error => {
    //         toast.error(`Failed to remove meal: ${error.message}`);
    //         closeConfirmDialog();
    //       });
    //   });
    // }
  };

  return (
    <>
      <Toolbar sx={{ mb: 2 }}>
        <Stack alignItems="center" direction="row" spacing={2}>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="meals-tag-select-label">Meal tags</InputLabel>
            <Select
              input={<OutlinedInput label="Meal tags" />}
              labelId="meals-tag-select-label"
              multiple
              onChange={handleTagChange}
              renderValue={(selected) => {
                if (selected.length === 0) return "All";
                return activeOptions
                  .filter((opt) => selected.includes(opt.id))
                  .map((opt) => opt.name)
                  .join(", ");
              }}
              value={selectedTagIds}
            >
              <MenuItem key="-1" value="-1">
                <Checkbox checked={isAllSelected} />
                <ListItemText primary="All" />
              </MenuItem>

              {activeOptions
                .filter(({ id }) => id !== "-1")
                .map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    <Checkbox checked={selectedTagIds.includes(id)} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <CountIndicator end={total} />
          <SearchField onChange={onSearchChange} value={search} />
        </Stack>

        <Button
          color="secondary"
          onClick={() => openDrawer()}
          sx={{ ml: "auto" }}
          variant="contained"
        >
          Add Meal
        </Button>
      </Toolbar>

      <MealsTable
        meals={meals}
        onRowClick={onRowClick}
        onSort={handleSortChange}
        order={order}
        orderBy={orderBy}
        setMealToRemove={setMealToRemove}
      />

      <TablePagination
        component="div"
        count={total}
        onPageChange={(_event, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onParamsChange([{ param: "limit", value: +e.target.value }])}
        page={page}
        rowsPerPage={limitParam}
      />

      <MealDrawer
        ingredients={ingredients}
        meal={drawerState.meal}
        mealTags={mealTags}
        onClose={closeDrawer}
        open={drawerState.open}
      />

      <ConfirmActionDialog
        description={`Are you sure you want to remove ${mealToRemove?.name ?? "this meal"}?`}
        handleClose={closeConfirmDialog}
        loading={isPending}
        onConfirm={handleRemoveMeal}
        open={Boolean(mealToRemove)}
      />
    </>
  );
}
