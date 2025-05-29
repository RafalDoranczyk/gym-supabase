"use client";

import CategoryIcon from "@mui/icons-material/Category";
import { Chip, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

type ChipCounterMenuProps = {
  activeOption: string;
  id: string;
  options: MenuOption[];
  setActiveOption: (name: string) => void;
};

type MenuOption = {
  id: number | string;
  name: string;
};

export function SelectMenu({ activeOption, id, options, setActiveOption }: ChipCounterMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <div>
      <Chip
        color="primary"
        icon={<CategoryIcon />}
        label={activeOption}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ px: 3, textTransform: "capitalize" }}
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
        {options
          .filter((option) => option.name !== activeOption)
          .map(({ name }) => (
            <MenuItem
              key={name}
              onClick={() => {
                setActiveOption(name);
                setAnchorEl(null);
              }}
            >
              {name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
