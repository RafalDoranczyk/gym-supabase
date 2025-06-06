// components/PageHeader.tsx
import { Box, Skeleton, Typography } from "@mui/material";
import type { ReactNode } from "react";

// Types
type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  subtitle?: string;
};

type PageHeaderSkeletonProps = {
  hasAction?: boolean;
  hasSubtitle?: boolean;
  titleWidth?: number | string;
  descriptionWidth?: number | string;
};

// Shared styling constants
const PAGE_HEADER_STYLING = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  mb: 4, // Consistent margin bottom
  gap: 2,
} as const;

export function PageHeaderSkeleton({
  hasAction = false,
  hasSubtitle = false,
  titleWidth = 200,
  descriptionWidth = 400,
}: PageHeaderSkeletonProps) {
  return (
    <Box sx={PAGE_HEADER_STYLING}>
      <Box sx={{ flex: 1 }}>
        {hasSubtitle && <Skeleton height={16} width={80} variant="text" sx={{ mb: 0.5 }} />}

        <Skeleton height={40} width={titleWidth} variant="text" sx={{ mb: 1 }} />

        <Skeleton height={24} width={descriptionWidth} variant="text" />
      </Box>

      {hasAction && (
        <Box sx={{ flexShrink: 0 }}>
          <Skeleton height={40} width={140} variant="rounded" sx={{ borderRadius: 1 }} />
        </Box>
      )}
    </Box>
  );
}

export function PageHeader({ title, description, action, subtitle }: PageHeaderProps) {
  return (
    <Box sx={PAGE_HEADER_STYLING}>
      <Box sx={{ flex: 1 }}>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              fontWeight: 600,
              letterSpacing: 0.5,
              mb: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        )}

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            mb: description ? 1 : 0,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
            {description}
          </Typography>
        )}
      </Box>

      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
