import { NutritionTable, type NutritionTableHeadCell, TooltipIconButton } from "@/components";
import { EmptyState } from "@/components/EmptyState";
import type { TableData, TableOrder } from "@/hooks";
import { KeyboardArrowRight, LocalPizza } from "@mui/icons-material";
import { Box, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { INGREDIENT_UNIT_TYPES, type Ingredient } from "@repo/schemas";

const headCells: NutritionTableHeadCell[] = [
  { id: "name", label: "Name", numeric: false, width: 200 },
  { id: "unit_type", label: "Unit Type", numeric: true, width: 110 },
  { id: "calories", label: "Calories", numeric: true, width: 100 },
  { id: "carbs", label: "Carbs (g)", numeric: true, width: 100 },
  { id: "protein", label: "Protein (g)", numeric: true, width: 100 },
  { id: "fat", label: "Fat (g)", numeric: true, width: 100 },
  { id: "price", label: "Price", numeric: true, width: 100 },
];

type IngredientsTableProps = {
  ingredients: Ingredient[];
  onRowClick: (ingredient: Ingredient) => void;
  onSort: (orderBy: TableOrder, property: keyof TableData) => void;
  order?: TableOrder;
  orderBy?: keyof TableData;
  setIngredientToRemove: (ingredient: Ingredient) => void;
};

export function IngredientsTable({
  ingredients,
  onRowClick,
  onSort,
  order,
  orderBy,
  setIngredientToRemove,
}: IngredientsTableProps) {
  if (ingredients.length === 0) {
    return (
      <EmptyState
        subtitle="Please add some ingredients to your list"
        title="No ingredients found"
      />
    );
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
        {ingredients.map((ingredient) => {
          const { calories, carbs, fat, id, name, price, protein, unit_type } = ingredient;

          return (
            <TableRow
              hover
              key={id}
              onClick={() => onRowClick(ingredient)}
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
                      {name}
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

              <TableCell align="right" sx={{ width: 110 }}>
                {INGREDIENT_UNIT_TYPES[unit_type]}
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
                    setIngredientToRemove(ingredient);
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
