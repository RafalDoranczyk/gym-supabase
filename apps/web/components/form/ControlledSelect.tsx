import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select as MaterialSelect,
  MenuItem,
} from "@mui/material";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";

type SelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: { id: PathValue<T, Path<T>>; name: string }[];
  defaultValue?: PathValue<T, Path<T>>;
  errorMessage?: string;
};

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  defaultValue,
  errorMessage,
}: SelectProps<T>) {
  return (
    <FormControl error={!!errorMessage} sx={{ m: 1, minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ("" as PathValue<T, Path<T>>)}
        render={({ field }) => (
          <MaterialSelect label={label} {...field}>
            {options.map(({ id, name }) => (
              <MenuItem key={String(id)} value={id}>
                {name}
              </MenuItem>
            ))}
          </MaterialSelect>
        )}
      />
      {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}
