"use client";

import { useTheme } from "@mui/material";
import type { EmptySvgProps } from "./EmptyState";

// Calendar icon for empty history
export function EmptyHistoryImage({ height, width }: EmptySvgProps) {
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

      <rect
        x="80"
        y="100"
        width="120"
        height="100"
        rx="8"
        fill={palette.background.paper}
        stroke={palette.primary.main}
        strokeWidth="3"
        opacity="0.9"
      />

      {/* Calendar header */}
      <rect
        x="80"
        y="100"
        width="120"
        height="25"
        rx="8"
        fill={palette.primary.main}
        opacity="0.8"
      />
      <rect x="80" y="115" width="120" height="10" fill={palette.primary.main} opacity="0.8" />

      {/* Calendar rings */}
      <rect x="105" y="85" width="4" height="30" rx="2" fill={palette.primary.main} opacity="0.7" />
      <rect x="135" y="85" width="4" height="30" rx="2" fill={palette.primary.main} opacity="0.7" />
      <rect x="165" y="85" width="4" height="30" rx="2" fill={palette.primary.main} opacity="0.7" />

      {/* Calendar grid */}
      <g opacity="0.3">
        <rect
          x="90"
          y="140"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="108"
          y="140"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="126"
          y="140"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="144"
          y="140"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="162"
          y="140"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="180"
          y="140"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="90"
          y="158"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="108"
          y="158"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="126"
          y="158"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="144"
          y="158"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="162"
          y="158"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
        <rect
          x="180"
          y="158"
          width="12"
          height="12"
          rx="2"
          stroke={palette.primary.main}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 2"
        />
      </g>

      {/* Clock overlay */}
      <circle
        cx="170"
        cy="170"
        r="18"
        fill={palette.background.paper}
        stroke={palette.primary.main}
        strokeWidth="2"
        opacity="0.9"
      />
      <circle
        cx="170"
        cy="170"
        r="12"
        fill="none"
        stroke={palette.primary.main}
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="170"
        y1="170"
        x2="170"
        y2="162"
        stroke={palette.primary.main}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="170"
        y1="170"
        x2="176"
        y2="170"
        stroke={palette.primary.main}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <circle cx="170" cy="158" r="1" fill={palette.primary.main} opacity="0.5" />
      <circle cx="182" cy="170" r="1" fill={palette.primary.main} opacity="0.5" />
      <circle cx="170" cy="182" r="1" fill={palette.primary.main} opacity="0.5" />
      <circle cx="158" cy="170" r="1" fill={palette.primary.main} opacity="0.5" />
    </svg>
  );
}
