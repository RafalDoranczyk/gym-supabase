"use client";

import { Delete, Edit, Scale, Straighten } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { MeasurementWithType } from "@repo/schemas";

type MeasurementsTableProps = {
  measurements: MeasurementWithType[];
  onEdit?: (measurement: MeasurementWithType) => void;
  onDelete?: (measurement: MeasurementWithType) => void;
};

// Helper function to get the actual unit string
function getDisplayUnit(measurement: MeasurementWithType): string {
  const { unit, measurement_type } = measurement;

  if (unit === "imperial" && measurement_type.unit_imperial) {
    return measurement_type.unit_imperial;
  }

  return measurement_type.unit_metric;
}

export function MeasurementsTable({ measurements, onEdit, onDelete }: MeasurementsTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMeasurementIcon = (category: string) => {
    switch (category) {
      case "weight":
        return <Scale fontSize="small" sx={{ color: "primary.main" }} />;
      case "body":
        return <Straighten fontSize="small" sx={{ color: "secondary.main" }} />;
      default:
        return <Straighten fontSize="small" sx={{ color: "text.secondary" }} />;
    }
  };

  const getCategoryChip = (category: string) => {
    const colors = {
      weight: { bg: "#8b5cf6", text: "#ffffff" },
      body_composition: { bg: "#06b6d4", text: "#ffffff" },
      circumference: { bg: "#10b981", text: "#ffffff" },
      height: { bg: "#f59e0b", text: "#ffffff" },
      health: { bg: "#ef4444", text: "#ffffff" },
      custom: { bg: "#6b7280", text: "#ffffff" },
    };

    const color = colors[category as keyof typeof colors] || colors.custom;

    return (
      <Chip
        label={category.replace("_", " ")}
        size="small"
        sx={{
          backgroundColor: color.bg,
          color: color.text,
          fontSize: "0.75rem",
          textTransform: "capitalize",
        }}
      />
    );
  };

  const getUnitSystemChip = (unit: "metric" | "imperial") => {
    return (
      <Chip
        label={unit}
        size="small"
        variant="outlined"
        sx={{
          fontSize: "0.7rem",
          height: "20px",
          textTransform: "capitalize",
          borderColor: unit === "metric" ? "primary.main" : "secondary.main",
          color: unit === "metric" ? "primary.main" : "secondary.main",
        }}
      />
    );
  };

  return (
    <Paper sx={{ boxShadow: 2, borderRadius: 2, overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Value</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Unit System</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Notes</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {measurements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}
                  >
                    <Scale sx={{ fontSize: 48, color: "text.disabled", opacity: 0.3 }} />
                    <Typography color="text.disabled" variant="h6">
                      No measurements recorded yet
                    </Typography>
                    <Typography color="text.disabled" variant="body2">
                      Start tracking your progress by adding your first measurement
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              measurements.map((measurement) => (
                <TableRow
                  key={measurement.id}
                  sx={{
                    "&:hover": { backgroundColor: "grey.50" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      {getMeasurementIcon(measurement.measurement_type.category || "custom")}
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {measurement.measurement_type.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {measurement.value} {getDisplayUnit(measurement)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getUnitSystemChip(measurement.unit)}</TableCell>
                  <TableCell>
                    {getCategoryChip(measurement.measurement_type.category || "custom")}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(measurement.measured_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={measurement.notes ? "text.primary" : "text.disabled"}
                      sx={{
                        fontStyle: measurement.notes ? "normal" : "italic",
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {measurement.notes || "No notes"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                      <IconButton
                        size="small"
                        onClick={() => onEdit?.(measurement)}
                        sx={{
                          color: "primary.main",
                          "&:hover": { backgroundColor: "primary.main", color: "white" },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete?.(measurement)}
                        sx={{
                          color: "error.main",
                          "&:hover": { backgroundColor: "error.main", color: "white" },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
