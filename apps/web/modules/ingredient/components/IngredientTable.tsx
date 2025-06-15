"use client";

import { Table, TooltipIconButton, type TableHeadCell, type TableOrder } from "@/components";
import { usePagination } from "@/hooks";
import { Box, Typography } from "@mui/material";
import { INGREDIENTS_DEFAULT_PAGE_SIZE, INGREDIENT_UNIT_TYPES } from "../constants";
import type { Ingredient } from "../schemas";
import { formatNutritionValue } from "../utils/formatNutritionValue";

const NUTRITION_CELL_WIDTH = 100;

const headCells: TableHeadCell[] = [
  { id: "name", label: "Name", numeric: false, width: NUTRITION_CELL_WIDTH * 1.5, sortable: true },
  { id: "unit_type", label: "Unit Type", numeric: true, width: NUTRITION_CELL_WIDTH },
  { id: "calories", label: "Calories", numeric: true, width: NUTRITION_CELL_WIDTH },
  { id: "carbs", label: "Carbs (g)", numeric: true, width: NUTRITION_CELL_WIDTH },
  { id: "protein", label: "Protein (g)", numeric: true, width: NUTRITION_CELL_WIDTH },
  { id: "fat", label: "Fat (g)", numeric: true, width: NUTRITION_CELL_WIDTH },
  { id: "price", label: "Price", numeric: true, width: NUTRITION_CELL_WIDTH },
];

type IngredientTableProps = {
  ingredients: Ingredient[];
  onRowClick: (ingredient: Ingredient) => void;
  onSort: (orderBy: TableOrder, property: string) => void;
  order?: TableOrder;
  orderBy?: string;
  setIngredientToDelete: (ingredient: Ingredient) => void;
  count: number;
};

const renderNutritionCell = (value?: number | null) => (
  <Table.Cell align="right" sx={{ width: NUTRITION_CELL_WIDTH }}>
    <Typography variant="body2" sx={{ color: value === 0 ? "text.disabled" : "inherit" }}>
      {formatNutritionValue(value)}
    </Typography>
  </Table.Cell>
);

export function IngredientTable({
  ingredients,
  onRowClick,
  onSort,
  order,
  orderBy,
  count,
  setIngredientToDelete,
}: IngredientTableProps) {
  const pagination = usePagination({ limit: INGREDIENTS_DEFAULT_PAGE_SIZE });

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
          {ingredients.map((ingredient) => {
            const { calories, carbs, fat, id, name, price, protein, unit_type } = ingredient;

            return (
              <Table.ZebraRow hover key={id} onClick={() => onRowClick(ingredient)}>
                <Table.Cell sx={{ width: NUTRITION_CELL_WIDTH * 1.5, p: 1 }}>
                  <Box
                    alignItems="center"
                    display="inline-flex"
                    sx={{ overflow: "hidden", flex: 1 }}
                  >
                    <Typography noWrap variant="subtitle2">
                      {name}
                    </Typography>
                  </Box>
                </Table.Cell>

                <Table.Cell align="right" sx={{ width: NUTRITION_CELL_WIDTH }}>
                  {INGREDIENT_UNIT_TYPES[unit_type]}
                </Table.Cell>

                {renderNutritionCell(calories)}
                {renderNutritionCell(carbs)}
                {renderNutritionCell(protein)}
                {renderNutritionCell(fat)}
                {renderNutritionCell(price)}

                <Table.Cell align="center" sx={{ width: 60 }}>
                  <TooltipIconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setIngredientToDelete(ingredient);
                    }}
                    size="small"
                    variant="delete"
                    sx={{
                      opacity: 0.3,
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  />
                </Table.Cell>
              </Table.ZebraRow>
            );
          })}
        </Table.Body>
      </Table.Root>

      <Table.Pagination
        count={count}
        page={pagination.page}
        rowsPerPage={pagination.limitParam}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
}
