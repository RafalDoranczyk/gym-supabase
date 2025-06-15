"use client";

import { Table, TooltipIconButton, type TableHeadCell, type TableOrder } from "@/components";
import { usePagination } from "@/hooks";
import { Box, TableCell, TablePagination, Typography } from "@mui/material";
import { MEALS_DEFAULT_PAGE_SIZE } from "../constants";
import type { Meal } from "../schemas";
import { calculateTotalMealNutrition } from "../utils/calculateMealNutrition";

const NUTRITION_CELL_WIDTH = 100;
const NAME_CELL_WIDTH = 180;

const headCells: TableHeadCell[] = [
  { id: "name", label: "Name", numeric: false, width: NAME_CELL_WIDTH, sortable: true },
  { id: "calories", label: "Calories", numeric: true, width: NUTRITION_CELL_WIDTH },
  { id: "carbs", label: "Carbs (g)", numeric: true, width: NUTRITION_CELL_WIDTH },
  { id: "protein", label: "Protein (g)", numeric: true, width: NUTRITION_CELL_WIDTH },
  { id: "fat", label: "Fat (g)", numeric: true, width: NUTRITION_CELL_WIDTH },
  { id: "price", label: "Price", numeric: true, width: NUTRITION_CELL_WIDTH },
];

type MealTableProps = {
  meals: Meal[];
  onRowClick: (meal: Meal) => void;
  onSort: (orderBy: TableOrder, property: string) => void;
  order?: TableOrder;
  orderBy?: string;
  setMealToDelete: (meal: Meal) => void;
  count: number;
};

// Helper function to format numeric values
const formatNumericValue = (value?: number | null): string => {
  if (value === null || value === undefined || value === 0) {
    return "—";
  }
  return value.toString();
};

// Helper function to render nutrition cells consistently
const renderNutritionCell = (value?: number | null) => (
  <TableCell align="right" sx={{ width: NUTRITION_CELL_WIDTH }}>
    <Typography variant="body2" sx={{ color: value === 0 ? "text.disabled" : "inherit" }}>
      {formatNumericValue(value)}
    </Typography>
  </TableCell>
);

export function MealTable({
  meals,
  onRowClick,
  onSort,
  order,
  orderBy,
  setMealToDelete,
  count,
}: MealTableProps) {
  const pagination = usePagination({ limit: MEALS_DEFAULT_PAGE_SIZE });

  const onPageChange = (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    pagination.onPageChange(page);
  };

  const onRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newLimit = Number(event.target.value);
    if (newLimit > 0) {
      pagination.onParamsChange([{ param: "limit", value: newLimit }]);
    }
  };

  return (
    <>
      <Table.Root
        sx={{
          maxHeight: 950,
        }}
      >
        <Table.Head
          headCells={headCells}
          onRequestSort={(_event, property) => {
            const isAsc = orderBy === property && order === "asc";
            onSort(isAsc ? "desc" : "asc", property);
          }}
          order={order}
          orderBy={orderBy}
        />
        <Table.Body>
          {meals.map((meal) => {
            const { calories, carbs, fat, price, protein } = calculateTotalMealNutrition(
              meal.meal_ingredients ?? []
            );

            return (
              <Table.Row hover key={meal.id} onClick={() => onRowClick(meal)}>
                <Table.Cell sx={{ minWidth: NAME_CELL_WIDTH, p: 1 }}>
                  <Box
                    alignItems="center"
                    display="inline-flex"
                    sx={{ overflow: "hidden", flex: 1 }}
                  >
                    <Typography noWrap variant="subtitle2">
                      {meal.name}
                    </Typography>
                  </Box>
                </Table.Cell>

                {renderNutritionCell(calories)}
                {renderNutritionCell(carbs)}
                {renderNutritionCell(protein)}
                {renderNutritionCell(fat)}
                {renderNutritionCell(price)}

                <Table.Cell align="center">
                  <TooltipIconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setMealToDelete(meal);
                    }}
                    size="small"
                    variant="delete"
                    sx={{
                      opacity: 0.3,
                      textAlign: "center",
                      width: 60,
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      <TablePagination
        count={count}
        component="div"
        page={pagination.page}
        rowsPerPage={pagination.limitParam}
        rowsPerPageOptions={[5, 10, 25, 50]}
        showFirstButton
        showLastButton
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
}
