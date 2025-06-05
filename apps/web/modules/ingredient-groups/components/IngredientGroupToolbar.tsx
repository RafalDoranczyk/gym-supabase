import { SearchField } from "@/components";

import { Add } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";

type IngredientGroupToolbarProps = {
  onCreateClick: () => void;
  onSearchChange: (value: string) => void;
  search?: string;
};

export function IngredientGroupToolbar({
  onSearchChange,
  search,
  onCreateClick,
}: IngredientGroupToolbarProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
      <Stack spacing={1} sx={{ flex: 1, maxWidth: "60%" }}>
        <Typography variant="h4">Ingredient Groups</Typography>
        <Typography variant="body2" color="textSecondary">
          Organize ingredients into categories for faster recipe creation.
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
        >
          Add Group
        </Button>
      </Stack>
    </Stack>
  );
}
