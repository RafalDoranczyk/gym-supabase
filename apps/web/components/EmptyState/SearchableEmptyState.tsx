import { EmptyState } from "@/components";
import { Add, FilterList } from "@mui/icons-material";
import { Button } from "@mui/material";

type SearchableEmptyStateProps = {
  search?: string;
  onAdd: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  config: {
    entityName: string;
    entityNameSingular: string;
    addButtonText: string;
    organizeText: string;
  };
};

export function SearchableEmptyState({
  search,
  onAdd,
  onClearFilters,
  hasActiveFilters,
  config,
}: SearchableEmptyStateProps) {
  const { entityName, entityNameSingular, addButtonText, organizeText } = config;

  // Filtered state - no results found
  if (hasActiveFilters) {
    const searchTerm = search?.trim();

    return (
      <EmptyState
        type="default"
        size="medium"
        title={searchTerm ? `No matching ${entityName}` : `No ${entityName} found`}
        subtitle={
          searchTerm
            ? `No ${entityNameSingular} match "${searchTerm}"`
            : `No ${entityNameSingular} found with current filters`
        }
        action={
          <Button variant="outlined" startIcon={<FilterList />} onClick={onClearFilters}>
            Clear Filters
          </Button>
        }
      />
    );
  }

  // Default empty state - no items exist or no search results
  const hasSearchTerm = search?.trim();
  const entityShortName = entityName.split(" ")[1] || entityName; // "tags" from "meal tags"
  const entityShortNameSingular = entityNameSingular.split(" ")[1] || entityNameSingular; // "tag" from "meal tag"

  return (
    <EmptyState
      type="default"
      size="medium"
      title={hasSearchTerm ? `No ${entityShortName} found` : `No ${entityName}`}
      subtitle={
        hasSearchTerm
          ? "Try using different keywords"
          : `Add your first ${entityShortNameSingular} to start ${organizeText}`
      }
      action={
        !hasSearchTerm ? (
          <Button variant="outlined" startIcon={<Add />} onClick={onAdd}>
            {addButtonText}
          </Button>
        ) : undefined
      }
    />
  );
}
