"use client";

import SearchIcon from "@mui/icons-material/Search";
import InputBase, { type InputBaseProps } from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

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
    // vertical padding + font size from searchIcon
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

export function SearchField(
  props: Omit<InputBaseProps, "onChange" | "value"> & {
    onChange: (value: string) => void;
    value?: string;
  },
) {
  const { onChange, value } = props;

  const [searchTerm, setSearchTerm] = useState<string>(value || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onChange, value]);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        {...props}
        inputProps={{ "aria-label": "search" }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        placeholder="Search…"
        value={searchTerm}
      />
    </Search>
  );
}
