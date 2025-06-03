import { EmptyState } from "@/components";
import { Add, FilterList } from "@mui/icons-material";
import { Button } from "@mui/material";

import { EMPTY_STATE_MESSAGES } from "../constants/emptyState";

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
        title={
          searchTerm ? EMPTY_STATE_MESSAGES.NO_MATCH_TITLE : EMPTY_STATE_MESSAGES.NO_FILTERS_TITLE
        }
        subtitle={
          searchTerm
            ? EMPTY_STATE_MESSAGES.SEARCH_NO_MATCH(searchTerm)
            : EMPTY_STATE_MESSAGES.FILTERED_NO_MATCH
        }
        action={
          <Button variant="outlined" startIcon={<FilterList />} onClick={onClearFilters}>
            {EMPTY_STATE_MESSAGES.CLEAR_FILTERS}
          </Button>
        }
      />
    );
  }

  // Default welcome state for new users
  return (
    <EmptyState
      title={EMPTY_STATE_MESSAGES.WELCOME_TITLE}
      subtitle={EMPTY_STATE_MESSAGES.WELCOME_SUBTITLE}
      action={
        <Button variant="contained" startIcon={<Add />} onClick={onAddIngredient}>
          {EMPTY_STATE_MESSAGES.ADD_INGREDIENT}
        </Button>
      }
    />
  );
}
