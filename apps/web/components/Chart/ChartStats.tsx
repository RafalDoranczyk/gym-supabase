import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type ChartStatsProps = {
  /**
   * Left side content (usually help text or info)
   */
  leftContent?: ReactNode;

  /**
   * Right side content (usually statistics)
   */
  rightContent?: ReactNode;

  /**
   * Top margin
   * @default 2
   */
  mt?: number;

  /**
   * Container padding
   * @default 2
   */
  p?: number;

  /**
   * Background color
   * @default "rgba(255, 255, 255, 0.02)"
   */
  backgroundColor?: string;

  /**
   * Border color
   * @default "rgba(255, 255, 255, 0.05)"
   */
  borderColor?: string;

  /**
   * Border radius
   * @default 1
   */
  borderRadius?: number;

  /**
   * Show border
   * @default true
   */
  showBorder?: boolean;
};

export function ChartStats({
  leftContent,
  rightContent,
  mt = 2,
  p = 2,
  backgroundColor = "rgba(255, 255, 255, 0.02)",
  borderColor = "rgba(255, 255, 255, 0.05)",
  borderRadius = 1,
  showBorder = true,
}: ChartStatsProps) {
  // Don't render if no content
  if (!(leftContent || rightContent)) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mt={mt}
      p={p}
      borderRadius={borderRadius}
      sx={{
        backgroundColor,
        ...(showBorder && {
          border: `1px solid ${borderColor}`,
        }),
      }}
    >
      {leftContent && (
        <Stack direction="row" alignItems="center" spacing={1}>
          {leftContent}
        </Stack>
      )}

      {rightContent && (
        <Stack direction="row" alignItems="center" spacing={1}>
          {rightContent}
        </Stack>
      )}
    </Stack>
  );
}

// Helper component for common info text pattern
export type ChartInfoTextProps = {
  icon?: ReactNode;
  text: string;
  variant?: "caption" | "body2";
  color?: string;
};

export function ChartInfoText({
  icon,
  text,
  variant = "caption",
  color = "textSecondary",
}: ChartInfoTextProps) {
  return (
    <>
      {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
      <Typography variant={variant} color={color}>
        {text}
      </Typography>
    </>
  );
}
