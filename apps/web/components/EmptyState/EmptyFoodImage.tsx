"use client";

import { useTheme } from "@mui/material";
import type { EmptySvgProps } from "./EmptyState";

// Shopping cart icon for empty food list
export function EmptyFoodImage({ height, width }: EmptySvgProps) {
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

      <g transform="translate(70, 100)">
        <path
          d="M7 4V2C7 1.45 6.55 1 6 1H1C0.45 1 0 1.45 0 2S0.45 3 1 3H5V4L7 4Z"
          transform="scale(8) translate(2, 8)"
          fill={palette.primary.main}
          opacity="0.7"
        />

        <rect
          x="15"
          y="25"
          width="110"
          height="70"
          rx="8"
          fill="none"
          stroke={palette.primary.main}
          strokeWidth="3"
          opacity="0.6"
        />

        <path
          d="M10 25 L5 10 L-10 10"
          fill="none"
          stroke={palette.primary.main}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Wheels */}
        <circle
          cx="35"
          cy="110"
          r="8"
          fill="none"
          stroke={palette.primary.main}
          strokeWidth="3"
          opacity="0.7"
        />
        <circle
          cx="105"
          cy="110"
          r="8"
          fill="none"
          stroke={palette.primary.main}
          strokeWidth="3"
          opacity="0.7"
        />

        {/* Add icon */}
        <circle
          cx="70"
          cy="60"
          r="20"
          fill={palette.background.paper}
          stroke={palette.primary.main}
          strokeWidth="2"
          opacity="0.9"
        />
        <line
          x1="60"
          y1="60"
          x2="80"
          y2="60"
          stroke={palette.primary.main}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="70"
          y1="50"
          x2="70"
          y2="70"
          stroke={palette.primary.main}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
