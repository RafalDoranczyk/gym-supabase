import { CountIndicator, SearchField } from "@/components";
import { Add, Category } from "@mui/icons-material";
import { Button, Chip, Menu, MenuItem, Stack, Toolbar } from "@mui/material";
import { useState } from "react";

type IngredientsToolbarProps = {
  filters: {
    group?: string;
    search?: string;
    activeOptions: { id: number | string; name: string }[];
  };
  actions: {
    onSearchChange: (value: string) => void;
    openDrawer: () => void;
    handleGroupChange: (name: string) => void;
  };
  ingredientsCount: number;
};

export function IngredientsToolbar({
  filters,
  actions,
  ingredientsCount,
}: IngredientsToolbarProps) {
  const { group, search, activeOptions } = filters;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { onSearchChange, openDrawer, handleGroupChange } = actions;

  const hasRealOptions = activeOptions.some((option) => option.id !== -1);
  const id = "ingredients-toolbar-menu";

  return (
    <Toolbar sx={{ mb: 2 }}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <div>
          <Chip
            color="primary"
            icon={<Category />}
            label={group}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ px: 3, textTransform: "capitalize" }}
            disabled={!hasRealOptions}
          />

          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              horizontal: "left",
              vertical: "top",
            }}
            aria-labelledby={id}
            id={id}
            onClose={() => setAnchorEl(null)}
            open={Boolean(anchorEl)}
            sx={{ textTransform: "capitalize" }}
            transformOrigin={{
              horizontal: "left",
              vertical: "top",
            }}
          >
            {activeOptions
              .filter((option) => option.name !== group)
              .map(({ name }) => (
                <MenuItem
                  key={name}
                  onClick={() => {
                    handleGroupChange(name);
                    setAnchorEl(null);
                  }}
                >
                  {name}
                </MenuItem>
              ))}
          </Menu>
        </div>
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
