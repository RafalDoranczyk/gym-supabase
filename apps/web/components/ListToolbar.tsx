"use client";

import { CountIndicator, DebouncedSearchFieldURL, MultiSelect } from "@/components";
import { Add, Category } from "@mui/icons-material";
import { Button, Chip, Menu, MenuItem, Stack, Toolbar } from "@mui/material";
import { useState } from "react";

const TOOLBAR_CONFIG = {
  SPACING: 2,
  CHIP_PADDING: 3,
  MULTISELECT_MIN_WIDTH: 200,
  MULTISELECT_MAX_WIDTH: 300,
} as const;

const MENU_ANCHOR_ORIGIN = {
  horizontal: "left",
  vertical: "top",
} as const;

type Option = {
  id: string;
  name: string;
};

type BaseToolbarProps = {
  search?: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  addButtonText: string;
  addButtonAriaLabel: string;
  count: number;
};

type DropdownFilterProps = {
  filterType: "dropdown";
  filterLabel: string;
  selectedValue?: string;
  options: Option[];
  onFilterChange: (value: string) => void;
  disabled?: boolean;
};

type MultiSelectFilterProps = {
  filterType: "multiselect";
  filterLabel: string;
  selectedValues: string[];
  options: Option[];
  onFilterChange: (values: string[]) => void;
};

type ListToolbarProps = BaseToolbarProps & (DropdownFilterProps | MultiSelectFilterProps);

// Helper function for dropdown filter
const getAvailableOptions = (options: Option[], currentValue?: string) => {
  return options
    .filter((option) => option.id !== "-1")
    .filter((option) => option.name !== currentValue);
};

export function ListToolbar(props: ListToolbarProps) {
  const { search, onSearchChange, onAdd, addButtonText, addButtonAriaLabel, count } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderFilter = () => {
    if (props.filterType === "multiselect") {
      return (
        <MultiSelect
          label={props.filterLabel}
          options={props.options}
          value={props.selectedValues}
          onChange={props.onFilterChange}
          size="small"
          sx={{
            minWidth: TOOLBAR_CONFIG.MULTISELECT_MIN_WIDTH,
            maxWidth: TOOLBAR_CONFIG.MULTISELECT_MAX_WIDTH,
          }}
        />
      );
    }

    // Dropdown filter
    const hasRealOptions = props.options.some((option) => option.id !== "-1");
    const availableOptions = getAvailableOptions(props.options, props.selectedValue);

    const handleOptionSelect = (optionName: string) => {
      props.onFilterChange(optionName);
      handleMenuClose();
    };

    return (
      <div>
        <Chip
          color="primary"
          icon={<Category />}
          label={props.selectedValue}
          onClick={handleMenuOpen}
          sx={{ px: TOOLBAR_CONFIG.CHIP_PADDING, textTransform: "capitalize" }}
          disabled={props.disabled || !hasRealOptions}
        />

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={MENU_ANCHOR_ORIGIN}
          id={`${props.filterLabel.toLowerCase().replace(/\s+/g, "-")}-toolbar-menu`}
          onClose={handleMenuClose}
          open={Boolean(anchorEl)}
          sx={{ textTransform: "capitalize" }}
          transformOrigin={MENU_ANCHOR_ORIGIN}
        >
          {availableOptions.map(({ name }) => (
            <MenuItem key={name} onClick={() => handleOptionSelect(name)}>
              {name}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  return (
    <Toolbar>
      <Stack alignItems="center" direction="row" spacing={TOOLBAR_CONFIG.SPACING}>
        {renderFilter()}
        <CountIndicator end={count} />
      </Stack>

      <Stack
        alignItems="center"
        direction="row"
        spacing={TOOLBAR_CONFIG.SPACING}
        sx={{ ml: "auto" }}
      >
        <DebouncedSearchFieldURL onChange={onSearchChange} value={search} />
        <Button
          aria-label={addButtonAriaLabel}
          onClick={onAdd}
          variant="contained"
          size="small"
          startIcon={<Add />}
        >
          {addButtonText}
        </Button>
      </Stack>
    </Toolbar>
  );
}
