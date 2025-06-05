import { EmptyState } from "@/components";
import { Add, FilterList } from "@mui/icons-material";
import { Button } from "@mui/material";

type IngredientGroupEmptyStateProps = {
  search?: string;
  onClearFilters: () => void;
  onAddIngredient: () => void;
  hasActiveFilters: boolean;
};

export function IngredientGroupEmptyState({
  search,
  onAddIngredient,
  onClearFilters,
  hasActiveFilters,
}: IngredientGroupEmptyStateProps) {
  // Early return for filtered state
  if (hasActiveFilters) {
    const searchTerm = search?.trim();

    return (
      <EmptyState
        title={searchTerm ? "No matching ingredient groups" : "No ingredient groups found"}
        subtitle={
          searchTerm
            ? `No ingredient group match "${searchTerm}"`
            : "No ingredient group found with current filters"
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
      title={search ? "No groups found" : "No ingredient groups"}
      subtitle={
        search
          ? "Try using different keywords"
          : "Add your first group to start organizing ingredients"
      }
      size="medium"
      action={
        !search ? (
          <Button variant="outlined" startIcon={<Add />} onClick={() => onAddIngredient()}>
            Add Group
          </Button>
        ) : undefined
      }
    />
  );
}
