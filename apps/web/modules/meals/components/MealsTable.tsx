import {
  EmptyState,
  NutritionTable,
  type NutritionTableHeadCell,
  TooltipIconButton,
} from "@/components";
import type { TableData, TableOrder } from "@/hooks";
import { KeyboardArrowRight, LocalPizza } from "@mui/icons-material";
import { Box, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import type { Meal } from "@repo/schemas";

import { calculateMealNutrition } from "../utils/calculateMealNutrition";

const headCells: NutritionTableHeadCell[] = [
  { id: "name", label: "Name", numeric: false, width: 200 },
  { id: "calories", label: "Calories", numeric: true, width: 100 },
  { id: "carbs", label: "Carbs (g)", numeric: true, width: 100 },
  { id: "protein", label: "Protein (g)", numeric: true, width: 100 },
  { id: "fat", label: "Fat (g)", numeric: true, width: 100 },
  { id: "price", label: "Price", numeric: true, width: 100 },
];

type MealsTableProps = {
  meals: Meal[];
  onRowClick: (meal: Meal) => void;
  onSort: (orderBy: TableOrder, property: keyof TableData) => void;
  order?: TableOrder;
  orderBy?: keyof TableData;
  setMealToRemove: (meal: Meal) => void;
};

export function MealsTable({
  meals,
  onRowClick,
  onSort,
  order,
  orderBy,
  setMealToRemove,
}: MealsTableProps) {
  if (meals.length === 0) {
    return <EmptyState subtitle="Please add some meals to your list" title="No meals found" />;
  }

  return (
    <NutritionTable.Root
      sx={{
        "& table": {
          tableLayout: "fixed",
        },
        maxHeight: 950,
      }}
    >
      <NutritionTable.Head
        headCells={headCells}
        onRequestSort={(e, property) => {
          const isAsc = orderBy === property && order === "asc";
          onSort(isAsc ? "desc" : "asc", property);
        }}
        order={order}
        orderBy={orderBy}
      />
      <TableBody>
        {meals.map((meal) => {
          const { calories, carbs, fat, price, protein } = calculateMealNutrition(
            meal.meal_ingredients,
          );

          return (
            <TableRow
              hover
              key={meal.id}
              onClick={() => onRowClick(meal)}
              sx={{
                "&:hover .delete-button-cell": {
                  opacity: 1,
                  visibility: "visible",
                },
                "&:hover svg.MuiSvgIcon-root": {
                  opacity: 1,
                },
                cursor: "pointer",
              }}
              tabIndex={-1}
            >
              <TableCell sx={{ minWidth: 200, p: 1 }}>
                <Box alignItems="center" display="flex" gap={1} sx={{ overflow: "hidden" }}>
                  <LocalPizza />
                  <Box
                    alignItems="center"
                    display="inline-flex"
                    sx={{ overflow: "hidden", whiteSpace: "nowrap" }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      variant="subtitle2"
                    >
                      {meal.name}
                    </Typography>

                    <KeyboardArrowRight
                      sx={{
                        flexShrink: 0,
                        ml: 0.5,
                        opacity: 0,
                        transition: "opacity .3s linear",
                      }}
                    />
                  </Box>
                </Box>
              </TableCell>

              <TableCell align="right" sx={{ width: 100 }}>
                {calories}
              </TableCell>
              <TableCell align="right" sx={{ width: 100 }}>
                {carbs}
              </TableCell>
              <TableCell align="right" sx={{ width: 100 }}>
                {protein}
              </TableCell>
              <TableCell align="right" sx={{ width: 100 }}>
                {fat}
              </TableCell>
              <TableCell align="right" sx={{ width: 100 }}>
                {price}
              </TableCell>
              <TableCell
                align="center"
                className="delete-button-cell"
                sx={{
                  opacity: 0,
                  textAlign: "center",
                  width: 60,
                }}
              >
                <TooltipIconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setMealToRemove(meal);
                  }}
                  size="small"
                  variant="delete"
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </NutritionTable.Root>
  );
}
