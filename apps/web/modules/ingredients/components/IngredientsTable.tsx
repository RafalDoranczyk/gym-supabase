import { NutritionTable, type NutritionTableHeadCell, TooltipIconButton } from "@/components";
import type { TableData, TableOrder } from "@/hooks";
import { KeyboardArrowRight } from "@mui/icons-material";
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

const TABLE_CONFIG = {
  MAX_HEIGHT: 950,
  CELL_PADDING: 1,
  ICON_TRANSITION: "opacity .3s linear",
  DELETE_BUTTON_WIDTH: 60,
  NAME_CELL_WIDTH: 200,
  UNIT_CELL_WIDTH: 110,
  NUTRITION_CELL_WIDTH: 100,
} as const;

type IngredientsTableProps = {
  ingredients: Ingredient[];
  onRowClick: (ingredient: Ingredient) => void;
  onSort: (orderBy: TableOrder, property: keyof TableData) => void;
  order?: TableOrder;
  orderBy?: keyof TableData;
  setIngredientToDelete: (ingredient: Ingredient) => void;
};

// Helper function to format numeric values
const formatNumericValue = (value: number | null | undefined): string => {
  if (value === null || value === undefined || value === 0) {
    return "—";
  }
  return value.toString();
};

// Helper function to render nutrition cells consistently
const renderNutritionCell = (
  value: number | null | undefined,
  width = TABLE_CONFIG.NUTRITION_CELL_WIDTH,
) => (
  <TableCell align="right" sx={{ width }}>
    <Typography variant="body2" sx={{ color: value === 0 ? "text.disabled" : "inherit" }}>
      {formatNumericValue(value)}
    </Typography>
  </TableCell>
);

export function IngredientsTable({
  ingredients,
  onRowClick,
  onSort,
  order,
  orderBy,
  setIngredientToDelete,
}: IngredientsTableProps) {
  return (
    <NutritionTable.Root
      sx={{
        "& table": {
          tableLayout: "fixed",
        },
        maxHeight: TABLE_CONFIG.MAX_HEIGHT,
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
                // Zebra striping - more subtle
                "&:nth-of-type(even)": {
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                },
                "&:hover": {
                  backgroundColor: "action.hover !important",
                },
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
              <TableCell
                sx={{ minWidth: TABLE_CONFIG.NAME_CELL_WIDTH, p: TABLE_CONFIG.CELL_PADDING }}
              >
                <Box alignItems="center" display="flex" gap={1} sx={{ overflow: "hidden" }}>
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
                        transition: TABLE_CONFIG.ICON_TRANSITION,
                      }}
                    />
                  </Box>
                </Box>
              </TableCell>

              <TableCell align="right" sx={{ width: TABLE_CONFIG.UNIT_CELL_WIDTH }}>
                {INGREDIENT_UNIT_TYPES[unit_type]}
              </TableCell>

              {renderNutritionCell(calories)}
              {renderNutritionCell(carbs)}
              {renderNutritionCell(protein)}
              {renderNutritionCell(fat)}
              {renderNutritionCell(price)}

              <TableCell
                align="center"
                className="delete-button-cell"
                sx={{
                  opacity: 0,
                  textAlign: "center",
                  width: TABLE_CONFIG.DELETE_BUTTON_WIDTH,
                }}
              >
                <TooltipIconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setIngredientToDelete(ingredient);
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
