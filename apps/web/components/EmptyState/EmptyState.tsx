import { Box, type BoxProps, Fade, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

import DefaultSvg from "./EmptySvg";

type EmptyStateProps = BoxProps & {
  action?: ReactNode;
  fullHeight?: boolean;
  size?: Sizes;
  subtitle?: string;
  title?: string;
  type?: ImageType;
};
type ImageType = "default";

type Sizes = "big" | "medium" | "small";

const ImageSizesMap: Record<Sizes, { height: number; width: number }> = {
  big: { height: 200, width: 200 },
  medium: { height: 150, width: 150 },
  small: { height: 100, width: 100 },
};

const ImageMap: Record<ImageType, React.FC<{ height: number; width: number }>> = {
  default: DefaultSvg,
};

export default function EmptyState({
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
    <Fade in>
      <Box
        alignItems="center"
        aria-label={title}
        display="flex"
        justifyContent="center"
        minHeight={fullHeight ? "100%" : "auto"}
        p={3}
        {...boxProps}
      >
        <Stack alignItems="center" maxWidth={360} spacing={2} textAlign="center">
          <Image {...imageSize} />

          <Typography variant="h6">{title}</Typography>

          {subtitle && (
            <Typography color="text.secondary" variant="body2">
              {subtitle}
            </Typography>
          )}

          {action && <Box mt={1}>{action}</Box>}
        </Stack>
      </Box>
    </Fade>
  );
}
