import { CountIndicator, SearchField } from "@/components";

import { Button, Stack, Toolbar } from "@mui/material";

import { Add } from "@mui/icons-material";

import { CategoryChipSelect } from "./CategoryChipSelect";

type IngredientsToolbarProps = {
  activeOptions: { id: number | string; name: string }[];
  group: string;
  ingredientsCount: number;
  onSearchChange: (value: string) => void;
  openDrawer: () => void;
  search?: string;
  handleGroupChange: (name: string) => void;
};

export function IngredientsToolbar({
  activeOptions,
  group,
  ingredientsCount,
  onSearchChange,
  openDrawer,
  search,
  handleGroupChange,
}: IngredientsToolbarProps) {
  return (
    <Toolbar sx={{ mb: 2 }}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <CategoryChipSelect
          activeOption={group}
          id="ingredients-filter-menu"
          options={activeOptions}
          setActiveOption={handleGroupChange}
        />
        <CountIndicator end={ingredientsCount} />
      </Stack>

      <Stack alignItems="center" direction="row" spacing={2} sx={{ ml: "auto" }}>
        <SearchField onChange={onSearchChange} value={search} />
        <Button
          aria-label="Add new ingredient"
          onClick={() => openDrawer()}
          variant="contained"
          size="small"
          startIcon={<Add />}
        >
          Add Ingredient
        </Button>
      </Stack>
    </Toolbar>
  );
}
