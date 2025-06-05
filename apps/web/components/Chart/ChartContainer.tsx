import { Box, type SxProps } from "@mui/material";
import type { ReactNode } from "react";

export interface ChartContainerProps {
  /**
   * Chart content
   */
  children: ReactNode;

  /**
   * Container height
   * @default 350
   */
  height?: number | string;

  /**
   * Show border
   * @default true
   */
  showBorder?: boolean;

  /**
   * Border style
   * @default "dashed"
   */
  borderStyle?: "solid" | "dashed" | "dotted";

  /**
   * Border color
   * @default "rgba(255, 255, 255, 0.2)"
   */
  borderColor?: string;

  /**
   * Background color
   * @default "transparent"
   */
  backgroundColor?: string;

  /**
   * Container padding
   * @default 1
   */
  p?: number;

  /**
   * Border radius
   * @default 2
   */
  borderRadius?: number;

  /**
   * Additional sx props
   */
  sx?: SxProps;
}

export function ChartContainer({
  children,
  height = 350,
  showBorder = true,
  borderStyle = "dashed",
  borderColor = "rgba(255, 255, 255, 0.2)",
  backgroundColor = "transparent",
  p = 2,
  borderRadius = 2,
  sx = {},
}: ChartContainerProps) {
  return (
    <Box
      height={height}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius={borderRadius}
      p={p}
      sx={{
        ...(showBorder && {
          border: `1px ${borderStyle} ${borderColor}`,
        }),
        backgroundColor,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
