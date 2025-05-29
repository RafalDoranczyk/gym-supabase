import {
  TextField as MaterialTextField,
  type TextFieldProps as MaterialTextFieldProps,
} from "@mui/material";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";

type ControlledTextFieldProps<TFieldValues extends FieldValues> = MaterialTextFieldProps & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>; // defaultValue musi pasować do pola
  label?: string;
};

export function ControlledTextField<TFieldValues extends FieldValues>({
  control,
  defaultValue,
  label,
  name,
  ...props
}: ControlledTextFieldProps<TFieldValues>) {
  const parseOnChange = (value: string, fn: (val: string) => void) => {
    const shouldParse = value && props.type === "number";

    if (shouldParse) {
      let parsedValue: string = value.toString();

      if (value.length > 1 && value[1] !== "." && value[1] !== ",") {
        parsedValue = value.replace(/^0+/, "");
      }

      fn(parsedValue);
    } else {
      fn(value);
    }
  };

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ field, formState }) => (
        <MaterialTextField
          {...field}
          {...props}
          error={!!formState?.errors?.[name]}
          label={label}
          onChange={(e) => {
            parseOnChange(e.target.value, field.onChange);
            if (props.onChange) {
              props.onChange(e);
            }
          }}
          sx={{
            textTransform: "capitalize",
            width: "100%",
          }}
        />
      )}
    />
  );
}
