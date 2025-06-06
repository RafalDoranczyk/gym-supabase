import { CountIndicator, DebouncedSearchFieldURL } from "@/components";
import { Add, Category } from "@mui/icons-material";
import { Button, Chip, Menu, MenuItem, Stack, Toolbar } from "@mui/material";
import { useState } from "react";

const TOOLBAR_CONFIG = {
  MENU_ID: "ingredients-toolbar-menu",
  SPACING: 2,
  CHIP_PADDING: 3,
} as const;

const MENU_ANCHOR_ORIGIN = {
  horizontal: "left",
  vertical: "top",
} as const;

type GroupOption = {
  id: string | number;
  name: string;
};

type IngredientsToolbarProps = {
  filters: {
    group?: string;
    search?: string;
    activeOptions: GroupOption[];
  };
  actions: {
    onSearchChange: (value: string) => void;
    openDrawer: () => void;
    handleGroupChange: (name: string) => void;
  };
  ingredientsCount: number;
};

// Helper function to get available groups for the dropdown
const getAvailableGroups = (activeOptions: GroupOption[], currentGroup?: string) => {
  return activeOptions
    .filter((option) => option.id !== -1) // Real options only
    .filter((option) => option.name !== currentGroup); // Exclude current selection
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
  const availableGroups = getAvailableGroups(activeOptions, group);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGroupSelect = (groupName: string) => {
    handleGroupChange(groupName);
    handleMenuClose();
  };

  return (
    <Toolbar>
      <Stack alignItems="center" direction="row" spacing={TOOLBAR_CONFIG.SPACING}>
        <div>
          <Chip
            color="primary"
            icon={<Category />}
            label={group}
            onClick={handleMenuOpen}
            sx={{ px: TOOLBAR_CONFIG.CHIP_PADDING, textTransform: "capitalize" }}
            disabled={!hasRealOptions}
          />

          <Menu
            anchorEl={anchorEl}
            anchorOrigin={MENU_ANCHOR_ORIGIN}
            aria-labelledby={TOOLBAR_CONFIG.MENU_ID}
            id={TOOLBAR_CONFIG.MENU_ID}
            onClose={handleMenuClose}
            open={Boolean(anchorEl)}
            sx={{ textTransform: "capitalize" }}
            transformOrigin={MENU_ANCHOR_ORIGIN}
          >
            {availableGroups.map(({ name }) => (
              <MenuItem key={name} onClick={() => handleGroupSelect(name)}>
                {name}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <CountIndicator end={ingredientsCount} />
      </Stack>

      <Stack
        alignItems="center"
        direction="row"
        spacing={TOOLBAR_CONFIG.SPACING}
        sx={{ ml: "auto" }}
      >
        <DebouncedSearchFieldURL onChange={onSearchChange} value={search} />
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
