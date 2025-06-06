import { SearchFieldURL, TooltipIconButton } from "@/components";
import { formatDate } from "@/utils";
import { Close, Remove, TrendingDown, TrendingUp } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import type { Measurement } from "@repo/schemas";
import { useMemo, useState } from "react";
import { FixedSizeList, type ListChildComponentProps } from "react-window";

type AllMeasurementsDialogProps = {
  open: boolean;
  onClose: () => void;
  measurements: Measurement[];
  onEditMeasurement?: (measurement: Measurement) => void;
  onDeleteMeasurement?: (measurementId: string) => void;
};

type MeasurementItemProps = ListChildComponentProps & {
  index: number;
  data: {
    measurements: Measurement[];
    onEdit?: (measurement: Measurement) => void;
    onDelete?: (measurementId: string) => void;
  };
};

function MeasurementItem({ index, data, style }: MeasurementItemProps) {
  const measurement = data.measurements[index];
  const prevMeasurement = data.measurements[index + 1]; // Sorted desc, so next is previous

  // Calculate change from previous measurement
  const getChangeInfo = () => {
    if (
      !prevMeasurement ||
      measurement.measurement_type_id !== prevMeasurement.measurement_type_id
    ) {
      return null;
    }

    const change = measurement.value - prevMeasurement.value;
    const isPositive = change > 0;
    const isNeutral = change === 0;

    return {
      change,
      isPositive,
      isNeutral,
      icon: isNeutral ? <Remove /> : isPositive ? <TrendingUp /> : <TrendingDown />,
      chipSx: isNeutral
        ? {
            borderColor: "grey.400",
            color: "grey.600",
            "& .MuiChip-icon": { color: "grey.600" },
          }
        : isPositive
          ? {
              borderColor: "error.main",
              color: "error.main",
              "& .MuiChip-icon": { color: "error.main" },
            }
          : {
              borderColor: "success.main",
              color: "success.main",
              "& .MuiChip-icon": { color: "success.main" },
            },
    };
  };

  const changeInfo = getChangeInfo();
  return (
    <ListItem
      style={style}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:hover": {
          backgroundColor: "action.hover",
        },
        py: 1.5,
      }}
    >
      <Box width="100%">
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              {/* ZMIANA: Typography z component="span" */}
              <Typography component="span" variant="overline" sx={{ color: "text.secondary" }}>
                {measurement.measurement_type_id}
              </Typography>
              <Typography
                component="span"
                variant="h6"
                sx={{ color: "text.primary", fontWeight: 600 }}
              >
                {measurement.value} {measurement.unit}
              </Typography>
              {changeInfo && (
                <Chip
                  icon={changeInfo.icon}
                  label={`${changeInfo.change > 0 ? "+" : ""}${changeInfo.change.toFixed(1)}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 20,
                    ...changeInfo.chipSx,
                  }}
                />
              )}
            </Box>
          }
          secondary={
            <Box mt={0.5}>
              {/* ZMIANA: Typography z component="span" */}
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.secondary", display: "block" }}
              >
                {formatDate(measurement.measured_at)}
              </Typography>
              {measurement.notes && (
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ color: "text.disabled", fontStyle: "italic", display: "block" }}
                >
                  {measurement.notes}
                </Typography>
              )}
            </Box>
          }
        />
      </Box>

      <TooltipIconButton size="small" onClick={() => data.onEdit?.(measurement)} variant="edit" />

      <TooltipIconButton
        size="small"
        onClick={() => data.onDelete?.(measurement.id)}
        variant="delete"
      />
    </ListItem>
  );
}

export function AllMeasurementsDialog({
  open,
  onClose,
  measurements,
  onEditMeasurement,
  onDeleteMeasurement,
}: AllMeasurementsDialogProps) {
  const [search, setSearch] = useState("");

  // Filter and sort measurements
  const filteredMeasurements = useMemo(() => {
    let filtered = measurements;

    // Filter by search query
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (measurement) =>
          measurement.measurement_type_id.toLowerCase().includes(query) ||
          measurement.value.toString().includes(query) ||
          measurement.notes?.toLowerCase().includes(query) ||
          new Date(measurement.measured_at).toLocaleDateString().includes(query)
      );
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
    );
  }, [measurements, search]);

  const handleClearSearch = () => {
    setSearch("");
  };

  const itemData = {
    measurements: filteredMeasurements,
    onEdit: onEditMeasurement,
    onDelete: onDeleteMeasurement,
  };

  const showVirtualiedList = filteredMeasurements.length === 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">All Measurements ({filteredMeasurements.length})</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}>
        <Box p={2} borderBottom="1px solid" borderColor="divider">
          <SearchFieldURL value={search} onChange={setSearch} />
        </Box>

        {showVirtualiedList && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            flexDirection="column"
            gap={2}
          >
            <Typography variant="h6" color="text.secondary">
              {search ? "No measurements found" : "No measurements yet"}
            </Typography>
            {search && (
              <Button variant="outlined" onClick={handleClearSearch}>
                Clear Search
              </Button>
            )}
          </Box>
        )}

        {!showVirtualiedList && (
          <FixedSizeList
            height={500}
            itemCount={filteredMeasurements.length}
            itemSize={80}
            itemData={itemData}
            overscanCount={10}
            width="100%"
          >
            {MeasurementItem}
          </FixedSizeList>
        )}
      </DialogContent>
    </Dialog>
  );
}
