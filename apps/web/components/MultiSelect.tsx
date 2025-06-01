import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select as MaterialSelect,
  type SelectChangeEvent,
} from "@mui/material";

type MultiSelectProps = {
  label: string;
  options: { id: string; name: string }[];
  value: string[];
  onChange: (selected: string[]) => void;
  size?: "small" | "medium";
  fullWidth?: boolean;
  sx: React.CSSProperties;
};

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  size = "medium",
  fullWidth = false,
  sx,
}: MultiSelectProps) {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValue = event.target.value;
    const selectedArray =
      typeof selectedValue === "string" ? selectedValue.split(",") : selectedValue;

    // Handle "All" selection - it has empty string value ""
    if (selectedArray.includes("")) {
      // If "All" was just selected and we have other items, clear everything (select all)
      if (value.length < options.length) {
        onChange(options.map((opt) => opt.id));
      } else {
        // If all were selected and "All" clicked, deselect all
        onChange([]);
      }
      return;
    }

    onChange(selectedArray);
  };

  const handleAllClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (value.length === options.length) {
      // If all selected, deselect all
      onChange([]);
    } else {
      // If not all selected, select all
      onChange(options.map((opt) => opt.id));
    }
  };

  const renderValue = (selected: unknown) => {
    const selectedArray = selected as string[];
    if (!selectedArray || selectedArray.length === 0) {
      return <em style={{ color: "#666" }}>All</em>;
    }
    if (selectedArray.length === 1) {
      const option = options.find((opt) => opt.id === selectedArray[0]);
      return option?.name || "All";
    }
    if (selectedArray.length === options.length) {
      return "All";
    }
    return `${selectedArray.length} selected`;
  };

  const isAllSelected = value.length === options.length;
  const isIndeterminate = value.length > 0 && value.length < options.length;

  return (
    <FormControl size={size} fullWidth={fullWidth} sx={sx}>
      <InputLabel>{label}</InputLabel>
      <MaterialSelect
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={renderValue}
        size={size}
      >
        {/* Select All option */}
        <MenuItem value="" onClick={handleAllClick}>
          <Checkbox checked={isAllSelected} indeterminate={isIndeterminate} size="small" />
          <ListItemText
            primary="All"
            slotProps={{
              primary: {
                variant: "body2",
                sx: { fontWeight: isAllSelected ? 600 : 400 },
              },
            }}
          />
        </MenuItem>

        {/* Individual options */}
        {options.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            <Checkbox checked={value.includes(id)} size="small" />
            <ListItemText
              primary={name}
              slotProps={{
                primary: {
                  sx: { fontWeight: value.includes(id) ? 600 : 400 },
                },
              }}
            />
          </MenuItem>
        ))}
      </MaterialSelect>
    </FormControl>
  );
}
