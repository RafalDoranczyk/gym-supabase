"use client";

import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { type Dayjs } from "dayjs";
import { forwardRef, useEffect, useState } from "react";

type ButtonFieldProps = {
  label?: React.ReactNode;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  disabled?: boolean;
  id?: string;
  ref?: React.Ref<HTMLButtonElement>;
  inputProps?: {
    "aria-label"?: string;
  };
};

const ButtonField = forwardRef<HTMLButtonElement, ButtonFieldProps>((props, ref) => {
  const {
    disabled,
    id,
    inputProps: { "aria-label": ariaLabel } = {},
    label,
    onClick,
    onKeyDown,
  } = props;

  return (
    <Button
      aria-label={ariaLabel}
      disabled={disabled}
      id={id}
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={ref}
      size="small"
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: "fit-content" }}
      variant="outlined"
    >
      {label || "Pick a date"}
    </Button>
  );
});

type DatePickerProps = {
  value?: Dayjs | null;
  onChange?: (newValue: Dayjs | null) => void;
  maxDate?: Dayjs;
  minDate?: Dayjs;
};

export function DatePicker({
  value: externalValue,
  onChange: externalOnChange,
  maxDate,
  minDate,
}: DatePickerProps = {}) {
  const [internalValue, setInternalValue] = useState<Dayjs | null>(dayjs(new Date()));
  const [open, setOpen] = useState(false);

  // Use external value if provided, otherwise use internal state
  const value = externalValue !== undefined ? externalValue : internalValue;
  const onChange = externalOnChange || setInternalValue;

  // Sync internal state with external value
  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        label={value?.format("MMM DD, YYYY") || null}
        value={value}
        onChange={onChange}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        views={["day", "month", "year"]}
        maxDate={maxDate}
        minDate={minDate}
        slots={{
          field: ButtonField,
        }}
        slotProps={{
          field: {
            onClick: () => setOpen(!open),
          },
          actionBar: {
            actions: ["clear", "today"],
          },
          toolbar: {
            toolbarFormat: "DD MMMM YYYY",
          },
        }}
      />
    </LocalizationProvider>
  );
}
