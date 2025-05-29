"use client";

import { CircularProgress, Autocomplete as MaterialAutocomplete, TextField } from "@mui/material";
import { useState } from "react";

type AutocompleteOptionBase = {
  id: number | string;
  name: string;
};

type AutocompleteProps<T extends AutocompleteOptionBase> = {
  disabled?: boolean;
  isLoading: boolean;
  label: string;
  onChange: (element: T) => void;
  options: T[];
};

export function Autocomplete<T extends AutocompleteOptionBase>({
  disabled = false,
  isLoading,
  label,
  onChange,
  options,
}: AutocompleteProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <MaterialAutocomplete
      clearOnBlur
      clearOnEscape
      disabled={disabled}
      fullWidth
      getOptionLabel={({ name }) => name}
      isOptionEqualToValue={({ name }, value) => name === value.name}
      loadingText="Loading..."
      noOptionsText={isLoading ? "Loading..." : "No results"}
      onChange={(_, element) => {
        if (element) {
          onChange(element);
        }
        setOpen(false);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          label={label}
          variant="outlined"
        />
      )}
    />
  );
}
