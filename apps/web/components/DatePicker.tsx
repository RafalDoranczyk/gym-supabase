"use client";

import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { UseDateFieldProps } from "@mui/x-date-pickers/DateField";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from "@mui/x-date-pickers/models";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";

interface ButtonFieldProps
  extends BaseSingleInputFieldProps<Dayjs | null, Dayjs, FieldSection, false, DateValidationError>,
    UseDateFieldProps<Dayjs, false> {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DatePicker() {
  const [value, setValue] = useState<Dayjs | null>(dayjs(new Date()));
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        label={value == null ? null : value.format("MMM DD, YYYY")}
        onChange={(newValue) => setValue(newValue)}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        slotProps={{
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          field: { setOpen } as any,
          nextIconButton: { size: "small" },
          previousIconButton: { size: "small" },
        }}
        slots={{ field: ButtonField }}
        value={value}
        views={["day", "month", "year"]}
      />
    </LocalizationProvider>
  );
}

function ButtonField(props: ButtonFieldProps) {
  const {
    disabled,
    id,
    InputProps: { ref } = {},
    inputProps: { "aria-label": ariaLabel } = {},
    label,
    setOpen,
  } = props;

  return (
    <Button
      aria-label={ariaLabel}
      disabled={disabled}
      id={id}
      onClick={() => setOpen?.((prev) => !prev)}
      ref={ref}
      size="small"
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: "fit-content" }}
      variant="outlined"
    >
      {label ? `${label}` : "Pick a date"}
    </Button>
  );
}
