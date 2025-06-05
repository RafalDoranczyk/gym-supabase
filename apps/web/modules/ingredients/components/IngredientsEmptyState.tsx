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
  // Early return for filtered state
  if (hasActiveFilters) {
    const searchTerm = search?.trim();

    return (
      <EmptyState
        title={searchTerm ? "No matching ingredients" : "No ingredients found"}
        subtitle={
          searchTerm
            ? `No ingredients match "${searchTerm}"`
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

  // Default welcome state for new users
  return (
    <EmptyState
      title="Start building your ingredients list"
      subtitle="Add your first ingredient to get started"
      action={
        <Button variant="contained" startIcon={<Add />} onClick={() => onAddIngredient()}>
          Add Ingredient
        </Button>
      }
    />
  );
}
