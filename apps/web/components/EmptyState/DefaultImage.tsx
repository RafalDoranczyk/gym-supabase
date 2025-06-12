"use client";

import { useTheme } from "@mui/material";
import type { EmptySvgProps } from "./EmptyState";

// Default geometric empty state icon
export function DefaultImage({ height, width }: EmptySvgProps) {
  const { palette } = useTheme();

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={height}
      viewBox="0 0 280 280"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="140" cy="140" r="100" fill={palette.primary.main} opacity="0.08" />

      <circle
        cx="140"
        cy="140"
        r="60"
        fill="none"
        stroke={palette.primary.main}
        strokeWidth="3"
        opacity="0.4"
        strokeDasharray="8 4"
      />

      <rect
        x="110"
        y="110"
        width="60"
        height="60"
        rx="8"
        fill={palette.background.paper}
        stroke={palette.primary.main}
        strokeWidth="2"
        opacity="0.8"
      />

      <circle
        cx="140"
        cy="140"
        r="20"
        fill="none"
        stroke={palette.primary.main}
        strokeWidth="2"
        opacity="0.5"
      />
      <circle cx="140" cy="140" r="8" fill={palette.primary.main} opacity="0.6" />

      <rect x="120" y="120" width="8" height="8" rx="2" fill={palette.primary.main} opacity="0.3" />
      <rect x="152" y="120" width="8" height="8" rx="2" fill={palette.primary.main} opacity="0.3" />
      <rect x="120" y="152" width="8" height="8" rx="2" fill={palette.primary.main} opacity="0.3" />
      <rect x="152" y="152" width="8" height="8" rx="2" fill={palette.primary.main} opacity="0.3" />

      <circle cx="90" cy="90" r="6" fill={palette.primary.main} opacity="0.2" />
      <circle cx="190" cy="90" r="6" fill={palette.primary.main} opacity="0.2" />
      <circle cx="90" cy="190" r="6" fill={palette.primary.main} opacity="0.2" />
      <circle cx="190" cy="190" r="6" fill={palette.primary.main} opacity="0.2" />
    </svg>
  );
}
