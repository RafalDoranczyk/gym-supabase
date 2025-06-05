import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

export interface ChartHeaderProps {
  /**
   * Chart title
   */
  title: string;

  /**
   * Icon to display next to title
   */
  icon?: ReactNode;

  /**
   * Actions to display on the right side (e.g., filters, buttons)
   */
  actions?: ReactNode;

  /**
   * Additional content below title
   */
  subtitle?: string;

  /**
   * Title variant
   * @default "h5"
   */
  titleVariant?: "h4" | "h5" | "h6";

  /**
   * Bottom margin
   * @default 3
   */
  mb?: number;
}

export function ChartHeader({
  title,
  icon,
  actions,
  subtitle,
  titleVariant = "h5",
  mb = 3,
}: ChartHeaderProps) {
  return (
    <Box mb={mb}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={subtitle ? 1 : 0}>
        <Box display="flex" alignItems="center" gap={1.5}>
          {icon && (
            <Box
              component="span"
              sx={{
                fontSize: 28,
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                "& svg": { fontSize: "inherit" },
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant={titleVariant}>{title}</Typography>
        </Box>

        {actions && (
          <Box display="flex" alignItems="center" gap={2}>
            {actions}
          </Box>
        )}
      </Box>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" ml={icon ? 5 : 0}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
