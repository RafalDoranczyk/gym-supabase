import { SearchField } from "@/components";
import { Add } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";

type MealTagToolbarProps = {
  onCreateClick: () => void;
  onSearchChange: (value: string) => void;
  search?: string;
};

export function MealTagToolbar({ onCreateClick, onSearchChange, search }: MealTagToolbarProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
      <Stack spacing={1} sx={{ flex: 1, maxWidth: "60%" }}>
        <Typography variant="h4">Meal Tags</Typography>
        <Typography variant="body2" color="textSecondary">
          Tag meals by dietary properties to quickly find what you need.
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <SearchField onChange={onSearchChange} value={search} />
        <Button
          size="small"
          color="primary"
          variant="contained"
          startIcon={<Add />}
          onClick={() => onCreateClick()}
          aria-label="Add new meal tag"
        >
          Add Tag
        </Button>
      </Stack>
    </Stack>
  );
}
