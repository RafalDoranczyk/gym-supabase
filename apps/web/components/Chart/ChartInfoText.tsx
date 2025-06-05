import { Typography } from "@mui/material";
import type { ReactNode } from "react";

export interface ChartInfoTextProps {
  icon?: ReactNode;
  text: string;
  variant?: "caption" | "body2";
  color?: string;
}

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
