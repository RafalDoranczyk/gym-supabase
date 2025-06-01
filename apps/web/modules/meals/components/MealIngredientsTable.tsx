import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import type { CreateMealPayload, Ingredient } from "@repo/schemas";
import type { UseFieldArrayReturn } from "react-hook-form";

import {
  calculateMealIngredientNutrition,
  calculateMealNutrition,
} from "../utils/calculateMealNutrition";

type MealIngredientsTableProps = {
  ingredients: Ingredient[];
  fieldArray: UseFieldArrayReturn<CreateMealPayload, "ingredients">;
};

export function MealIngredientsTable({ ingredients, fieldArray }: MealIngredientsTableProps) {
  const { fields, append, remove, update } = fieldArray;

  const findIngredientById = (id: string) => ingredients.find((ing) => ing.id === id);

  const mealIngredients = fields
    .map(({ amount, ingredient_id }) => {
      const ingredient = findIngredientById(ingredient_id);
      return ingredient ? { amount, ingredient } : null;
    })
    .filter(Boolean) as { amount: number; ingredient: Ingredient }[];

  const totals = calculateMealNutrition(mealIngredients);

  const handleAddIngredient = (option: Ingredient | null) => {
    if (!option) return;
    if (fields.some((f) => f.ingredient_id === option.id)) return;

    const defaultAmount = option.unit_type === "g" ? 100 : option.unit_type === "kg" ? 0.1 : 1;

    append({ amount: defaultAmount, ingredient_id: option.id });
  };

  const handleAmountChange = (index: number, newAmount: number) => {
    const field = fields[index];
    if (!field) return;
    update(index, { ...field, amount: newAmount });
  };

  return (
    <Stack gap={3}>
      <Typography>Meal ingredients</Typography>
      <Autocomplete
        getOptionLabel={({ name }) => name}
        onChange={(_, newValue) => handleAddIngredient(newValue)}
        options={ingredients}
        renderInput={(params) => (
          <TextField {...params} label="Add ingredient" placeholder="Type to search..." />
        )}
      />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ingredient</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Protein</TableCell>
            <TableCell>Carbs</TableCell>
            <TableCell>Fat</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map(({ id, ingredient_id, amount }, index) => {
            const ingredient = findIngredientById(ingredient_id);
            if (!ingredient) return null;

            const macros = calculateMealIngredientNutrition({ amount, ingredient });

            return (
              <TableRow key={ingredient_id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>
                  <TextField
                    inputProps={{ min: 0 }}
                    onChange={(e) => handleAmountChange(index, Number(e.target.value))}
                    size="small"
                    sx={{ width: "100px" }}
                    type="number"
                    value={amount}
                  />
                </TableCell>
                <TableCell>{ingredient.unit_type}</TableCell>
                <TableCell>{macros.protein} g</TableCell>
                <TableCell>{macros.carbs} g</TableCell>
                <TableCell>{macros.fat} g</TableCell>
                <TableCell>{macros.calories} kcal</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        {fields.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
                <strong>Total</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.protein} g</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.carbs} g</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.fat} g</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.calories} kcal</strong>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </Stack>
  );
}
