"use client";

import {
  TextField,
  InputAdornment,
  Popover,
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { Palette } from "@mui/icons-material";
import { useState } from "react";

type MUIColorPickerProps = {
  selectedColor: string;
  onChange: (color: string) => void;
  error?: boolean;
  helperText?: string;
};

const colorPalette = {
  "Theme Colors": ["#8B5CF6", "#A78BFA", "#7C3AED", "#FF6B6B", "#FF8E8E", "#E55555"],
  "Material Purple": [
    "#F3E5F5",
    "#E1BEE7",
    "#CE93D8",
    "#BA68C8",
    "#AB47BC",
    "#9C27B0",
    "#8E24AA",
    "#7B1FA2",
  ],
  "Material Pink": [
    "#FCE4EC",
    "#F8BBD9",
    "#F48FB1",
    "#F06292",
    "#EC407A",
    "#E91E63",
    "#D81B60",
    "#C2185B",
  ],
  "Material Red": [
    "#FFEBEE",
    "#FFCDD2",
    "#EF9A9A",
    "#E57373",
    "#EF5350",
    "#F44336",
    "#E53935",
    "#D32F2F",
  ],
  "Material Orange": [
    "#FFF3E0",
    "#FFE0B2",
    "#FFCC80",
    "#FFB74D",
    "#FFA726",
    "#FF9800",
    "#FB8C00",
    "#F57C00",
  ],
  "Material Yellow": [
    "#FFFDE7",
    "#FFF9C4",
    "#FFF59D",
    "#FFF176",
    "#FFEE58",
    "#FFEB3B",
    "#FDD835",
    "#F9A825",
  ],
  "Material Green": [
    "#E8F5E8",
    "#C8E6C9",
    "#A5D6A7",
    "#81C784",
    "#66BB6A",
    "#4CAF50",
    "#43A047",
    "#388E3C",
  ],
  "Material Teal": [
    "#E0F2F1",
    "#B2DFDB",
    "#80CBC4",
    "#4DB6AC",
    "#26A69A",
    "#009688",
    "#00897B",
    "#00796B",
  ],
  "Material Blue": [
    "#E3F2FD",
    "#BBDEFB",
    "#90CAF9",
    "#64B5F6",
    "#42A5F5",
    "#2196F3",
    "#1E88E5",
    "#1976D2",
  ],
  "Material Grey": [
    "#FAFAFA",
    "#F5F5F5",
    "#EEEEEE",
    "#E0E0E0",
    "#BDBDBD",
    "#9E9E9E",
    "#757575",
    "#616161",
  ],
};

// Enhanced palette with theme colors first
function MUIColorPalette({
  selectedColor,
  onChange,
}: { selectedColor: string; onChange: (color: string) => void }) {
  return (
    <Box sx={{ p: 2, width: 320, maxHeight: 400, overflow: "auto" }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Choose a color
      </Typography>

      <Stack spacing={1.5}>
        {Object.entries(colorPalette).map(([name, colors]) => (
          <Box key={name}>
            <Typography
              variant="caption"
              sx={{
                mb: 0.5,
                display: "block",
                fontWeight: name === "Theme Colors" ? 600 : 400,
                color: name === "Theme Colors" ? "primary.main" : "text.secondary",
              }}
            >
              {name}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {colors.map((color) => (
                <Box
                  key={color}
                  onClick={() => onChange(color)}
                  sx={{
                    width: name === "Theme Colors" ? 32 : 24,
                    height: name === "Theme Colors" ? 32 : 24,
                    borderRadius: name === "Theme Colors" ? 1 : 0.5,
                    bgcolor: color,
                    cursor: "pointer",
                    border:
                      selectedColor === color ? "2px solid #1976d2" : "1px solid rgba(0,0,0,0.1)",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: 2,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Stack>

      <Typography variant="caption" sx={{ mt: 2, display: "block", color: "text.secondary" }}>
        💡 Tip: You can also type hex colors directly in the input field
      </Typography>
    </Box>
  );
}

export function ColorPicker({ selectedColor, onChange, error, helperText }: MUIColorPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [inputValue, setInputValue] = useState(selectedColor);

  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(value) || value === "") {
      onChange(value);
    }
  };

  const handlePaletteSelect = (color: string) => {
    setInputValue(color);
    onChange(color);
    setAnchorEl(null);
  };

  // Validate if current color is valid hex
  const isValidColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputValue);

  return (
    <>
      <TextField
        label="Group Color"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="#8B5CF6"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                  bgcolor: isValidColor ? inputValue : "transparent",
                  border: "1px solid",
                  borderColor: isValidColor ? "divider" : "error.main",
                }}
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="small"
                sx={{ color: "primary.main" }}
              >
                <Palette />
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={error || !isValidColor}
        helperText={
          error
            ? helperText
            : !isValidColor && inputValue
              ? "Please enter a valid hex color (e.g., #8B5CF6)"
              : helperText
        }
        required
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MUIColorPalette selectedColor={selectedColor} onChange={handlePaletteSelect} />
      </Popover>
    </>
  );
}
