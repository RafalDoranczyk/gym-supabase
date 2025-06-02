import { EmptyState } from "@/components";
import { Add, FilterList } from "@mui/icons-material";
import { Button } from "@mui/material";

type IngredientsEmptyStateProps = {
  hasActiveFilters: boolean;
  search?: string;
  onClearFilters: () => void;
  onAddIngredient: () => void;
};

export function IngredientsEmptyState({
  hasActiveFilters,
  search,
  onClearFilters,
  onAddIngredient,
}: IngredientsEmptyStateProps) {
  if (hasActiveFilters) {
    return (
      <EmptyState
        title="No ingredients found"
        subtitle={
          search?.trim()
            ? `No ingredients match "${search.trim()}"`
            : "No ingredients found with current filters"
        }
        action={
          <Button variant="outlined" startIcon={<FilterList />} onClick={onClearFilters}>
            Clear Filters
          </Button>
        }
      />
    );
  }

  return (
    <EmptyState
      title="No ingredients found"
      subtitle="Please add some ingredients to your list"
      action={
        <Button variant="outlined" startIcon={<Add />} onClick={onAddIngredient}>
          Add Ingredient
        </Button>
      }
    />
  );
}
