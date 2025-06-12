"use client";

import { useTheme } from "@mui/material";
import type { EmptySvgProps } from "./EmptyState";

// Analytics chart icon for empty data
export function EmptyChartImage({ height, width }: EmptySvgProps) {
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
        x="60"
        y="80"
        width="160"
        height="120"
        rx="8"
        fill="none"
        stroke={palette.primary.main}
        strokeWidth="3"
        opacity="0.6"
      />

      {/* Empty chart bars */}
      <rect
        x="80"
        y="150"
        width="20"
        height="30"
        fill="none"
        stroke={palette.primary.main}
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.4"
      />
      <rect
        x="115"
        y="130"
        width="20"
        height="50"
        fill="none"
        stroke={palette.primary.main}
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.4"
      />
      <rect
        x="150"
        y="110"
        width="20"
        height="70"
        fill="none"
        stroke={palette.primary.main}
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.4"
      />
      <rect
        x="185"
        y="140"
        width="20"
        height="40"
        fill="none"
        stroke={palette.primary.main}
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.4"
      />

      {/* Chart axes */}
      <line
        x1="70"
        y1="190"
        x2="210"
        y2="190"
        stroke={palette.primary.main}
        strokeWidth="2"
        opacity="0.5"
      />
      <line
        x1="70"
        y1="190"
        x2="70"
        y2="90"
        stroke={palette.primary.main}
        strokeWidth="2"
        opacity="0.5"
      />

      {/* No data indicator */}
      <circle
        cx="140"
        cy="140"
        r="25"
        fill={palette.background.paper}
        stroke={palette.primary.main}
        strokeWidth="2"
        opacity="0.9"
      />
      <text
        x="140"
        y="148"
        textAnchor="middle"
        fontSize="24"
        fontWeight="300"
        fill={palette.primary.main}
      >
        ?
      </text>

      <circle cx="90" cy="105" r="2" fill={palette.primary.main} opacity="0.3" />
      <circle cx="125" cy="115" r="2" fill={palette.primary.main} opacity="0.3" />
      <circle cx="160" cy="95" r="2" fill={palette.primary.main} opacity="0.3" />
      <circle cx="195" cy="125" r="2" fill={palette.primary.main} opacity="0.3" />
    </svg>
  );
}
