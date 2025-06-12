"use client";

import { Box, type BoxProps, Fade, Stack, Typography } from "@mui/material";

import { DefaultImage } from "./DefaultImage";
import { EmptyChartImage } from "./EmptyChartImage";
import { EmptyFoodImage } from "./EmptyFoodImage";
import { EmptyHistoryImage } from "./EmptyHistoryImage";
import { EmptyPlateImage } from "./EmptyPlateImage";

export type EmptySvgProps = {
  height: number;
  width: number;
};

type EmptyStateProps = BoxProps & {
  action?: React.ReactNode;
  fullHeight?: boolean;
  size?: Sizes;
  subtitle?: string;
  title?: string;
  type?: ImageType;
};

type ImageType = "default" | "plate" | "food" | "chart" | "history";

const ImageMap: Record<ImageType, React.FC<{ height: number; width: number }>> = {
  default: DefaultImage,
  plate: EmptyPlateImage,
  food: EmptyFoodImage,
  chart: EmptyChartImage,
  history: EmptyHistoryImage,
};

type Sizes = "big" | "medium" | "small";

const ImageSizesMap: Record<Sizes, { height: number; width: number }> = {
  big: { height: 200, width: 200 },
  medium: { height: 150, width: 150 },
  small: { height: 100, width: 100 },
};

export function EmptyState({
  action,
  fullHeight = true,
  size = "big",
  subtitle,
  title = "Nothing here yet",
  type = "default",
  ...boxProps
}: EmptyStateProps) {
  const Image = ImageMap[type];
  const imageSize = ImageSizesMap[size];

  return (
    <Fade in timeout={600}>
      <Box
        alignItems="center"
        aria-label={title}
        display="flex"
        justifyContent="center"
        minHeight={fullHeight ? "100%" : "auto"}
        p={3}
        {...boxProps}
      >
        <Stack alignItems="center" maxWidth={360} spacing={3} textAlign="center">
          {/* Simple Image */}
          <Box
            sx={{
              opacity: 0.8,
              transition: "opacity 0.2s ease",
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            <Image {...imageSize} />
          </Box>

          {/* Title */}
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          {/* Subtitle */}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}

          {/* Action */}
          {action && <Box mt={1}>{action}</Box>}
        </Stack>
      </Box>
    </Fade>
  );
}
