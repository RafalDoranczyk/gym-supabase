"use client";

import SearchIcon from "@mui/icons-material/Search";
import InputBase, { type InputBaseProps } from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";

const Search = styled("div")(({ theme }) => ({
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  borderRadius: theme.shape.borderRadius,
  marginLeft: 0,
  position: "relative",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  height: "100%",
  justifyContent: "center",
  padding: theme.spacing(0, 2),
  pointerEvents: "none",
  position: "absolute",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    [theme.breakpoints.up("sm")]: {
      "&:focus": {
        width: "24ch",
      },
      width: "16ch",
    },
    transition: theme.transitions.create("width"),
  },
  color: "inherit",
  width: "100%",
}));

type SearchFieldURLProps = Omit<InputBaseProps, "onChange" | "value"> & {
  onChange: (value: string) => void;
  value?: string;
  debounceMs?: number;
};

export function SearchFieldURL({
  onChange,
  value = "",
  debounceMs = 150,
  ...props
}: SearchFieldURLProps) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (value !== localValue && !isTypingRef.current) {
      setLocalValue(value);
    }
  }, [value, localValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (inputValue: string) => {
    // Mark as actively typing
    isTypingRef.current = true;

    // Update local value immediately
    setLocalValue(inputValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounced onChange call
    timeoutRef.current = setTimeout(() => {
      onChange(inputValue);
      // Mark typing as finished after URL update
      isTypingRef.current = false;
    }, debounceMs);
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        {...props}
        inputProps={{ "aria-label": "search" }}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search…"
        value={localValue}
      />
    </Search>
  );
}
