import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  spacing?: "default" | "large" | "small";
};

const SPACING_MAP = {
  small: { mt: 1, mb: 1 },
  default: { mt: 4, mb: 3 },
  large: { mt: 6, mb: 4 },
} as const;

export function SectionHeader({
  title,
  description,
  action,
  spacing = "default",
}: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: action ? "flex-start" : "center",
        ...SPACING_MAP[spacing],
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: description ? 0.5 : 0,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
            {description}
          </Typography>
        )}
      </Box>

      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
