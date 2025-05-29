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
import type { Ingredient, MealIngredient } from "@repo/schemas";
import { useRef, useState } from "react";

import {
  calculateMealIngredientNutrition,
  calculateMealNutrition,
} from "../utils/calculateMealNutrition";

interface MealIngredientsTableProps {
  ingredients: Ingredient[];
}

export function MealIngredientsTable({ ingredients }: MealIngredientsTableProps) {
  const [autoKey, setAutoKey] = useState(0);

  const [mealIngredients, setMealIngredients] = useState<MealIngredient[]>([]);

  const handleAddIngredient = (option: Ingredient | null) => {
    if (!option) return;
    if (mealIngredients.find((mi) => mi.ingredient.id === option.id)) return;

    const defaultAmount = option.unit_type === "g" ? 100 : option.unit_type === "kg" ? 0.1 : 1;

    setMealIngredients((prev) => [...prev, { amount: defaultAmount, ingredient: option }]);
    setAutoKey((prev) => prev + 1);
  };

  const handleAmountChange = (id: string, newAmount: number) => {
    setMealIngredients((prev) =>
      prev.map((mi) => (mi.ingredient.id === id ? { ...mi, amount: newAmount } : mi)),
    );
  };

  const totals = calculateMealNutrition(mealIngredients);

  return (
    <Stack gap={3}>
      <Typography>Ingredients</Typography>
      <Autocomplete
        getOptionLabel={({ name }) => name}
        key={autoKey}
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
          {mealIngredients.map(({ amount, ingredient }) => {
            const { id, name, unit_type } = ingredient;
            const macros = calculateMealIngredientNutrition({ amount, ingredient });

            return (
              <TableRow key={id}>
                <TableCell>{name}</TableCell>
                <TableCell>
                  <TextField
                    inputProps={{ min: 0 }}
                    onChange={(e) => handleAmountChange(id, Number.parseFloat(e.target.value))}
                    size="small"
                    sx={{ width: "100px" }}
                    type="number"
                    value={amount}
                  />
                </TableCell>
                <TableCell>{unit_type}</TableCell>
                <TableCell>{macros.protein} g</TableCell>
                <TableCell>{macros.carbs} g</TableCell>
                <TableCell>{macros.fat} g</TableCell>
                <TableCell>{macros.calories} kcal</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() =>
                      setMealIngredients((prev) =>
                        prev.filter((i) => i.ingredient.id !== ingredient.id),
                      )
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        {mealIngredients.length > 0 && (
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
