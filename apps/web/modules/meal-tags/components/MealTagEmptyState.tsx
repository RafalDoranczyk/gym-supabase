import { EmptyState } from "@/components";
import { Add, FilterList } from "@mui/icons-material";
import { Button } from "@mui/material";

type MealTagEmptyStateProps = {
  search?: string;
  onAddTag: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
};

export function MealTagEmptyState({
  search,
  onAddTag,
  onClearFilters,
  hasActiveFilters,
}: MealTagEmptyStateProps) {
  // Early return for filtered state
  if (hasActiveFilters) {
    const searchTerm = search?.trim();

    return (
      <EmptyState
        title={searchTerm ? "No matching meal tags" : "No meal tags found"}
        subtitle={
          searchTerm
            ? `No meal tag match "${searchTerm}"`
            : "No meal tag found with current filters"
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
      title={search ? "No tags found" : "No meal tags"}
      subtitle={
        search ? "Try using different keywords" : "Add your first tag to start organizing meals"
      }
      size="medium"
      action={
        !search ? (
          <Button variant="outlined" startIcon={<Add />} onClick={() => onAddTag()}>
            Add Tag
          </Button>
        ) : undefined
      }
    />
  );
}
