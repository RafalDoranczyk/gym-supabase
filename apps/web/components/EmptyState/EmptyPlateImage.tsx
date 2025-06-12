"use client";

import { useTheme } from "@mui/material";
import type { EmptySvgProps } from "./EmptyState";

// Empty plate icon for missing meals
export function EmptyPlateImage({ height, width }: EmptySvgProps) {
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
        opacity="0.6"
      />

      {/* Fork */}
      <g transform="translate(100, 120)">
        <rect x="0" y="0" width="2" height="40" fill={palette.primary.main} opacity="0.7" />
        <rect x="-3" y="0" width="2" height="12" fill={palette.primary.main} opacity="0.7" />
        <rect x="3" y="0" width="2" height="12" fill={palette.primary.main} opacity="0.7" />
        <circle cx="0" cy="-3" r="3" fill={palette.primary.main} opacity="0.7" />
      </g>

      {/* Knife */}
      <g transform="translate(180, 120)">
        <rect x="0" y="0" width="3" height="40" fill={palette.primary.main} opacity="0.7" />
        <path d="M0 0 L8 3 L8 8 L0 12 Z" fill={palette.primary.main} opacity="0.5" />
        <circle cx="1.5" cy="-3" r="3" fill={palette.primary.main} opacity="0.7" />
      </g>

      <circle cx="140" cy="140" r="8" fill={palette.primary.main} opacity="0.3" />
      <circle cx="140" cy="140" r="4" fill={palette.primary.main} opacity="0.6" />
    </svg>
  );
}
