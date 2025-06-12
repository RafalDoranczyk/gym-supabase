import { formatDate } from "@/utils";
import { MoreVert } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import type React from "react";

type BaseItem = {
  name: string;
  description?: string | null;
  color: string;
  examples: string[];
  created_at: string;
  updated_at?: string | null;
};

type CategoryCardProps<T extends BaseItem> = {
  item: T;
  onMenuClick: (event: React.MouseEvent<HTMLButtonElement>, item: T) => void;
  config: {
    countLabel: string;
    countValue: number;
    emptyExamplesText: string;
    fallbackIcon?: React.ReactNode;
    defaultColor?: string;
  };
};

export function CategoryCard<T extends BaseItem>({
  item,
  onMenuClick,
  config,
}: CategoryCardProps<T>) {
  const { countLabel, countValue, emptyExamplesText, fallbackIcon, defaultColor } = config;
  const hasExamples = item.examples.length > 0;
  const chipColor = item.color || defaultColor;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {item.color ? (
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: item.color,
                  border: `2px solid ${item.color}40`,
                  flexShrink: 0,
                }}
              />
            ) : (
              fallbackIcon && (
                <Box sx={{ fontSize: 16, color: "text.secondary" }}>{fallbackIcon}</Box>
              )
            )}
            <Typography variant="h6">{item.name}</Typography>
          </Box>

          <IconButton size="small" onClick={(e) => onMenuClick(e, item)}>
            <MoreVert />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: item.description ? "text.secondary" : "text.disabled",
            minHeight: "2.5em",
            flex: "0 0 auto",
          }}
        >
          {item.description || "No description provided"}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
          {countValue} {countLabel.slice(0, -1)}
          {countValue !== 1 ? countLabel.slice(-1) : ""}
        </Typography>

        <Box sx={{ flex: 1 }}>
          {!hasExamples && (
            <Typography
              variant="caption"
              sx={{
                color: "text.disabled",
                fontStyle: "italic",
                display: "block",
                py: 1,
              }}
            >
              {emptyExamplesText}
            </Typography>
          )}

          {hasExamples && (
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
              {item.examples.slice(0, 3).map((example) => (
                <Chip
                  key={example}
                  label={example}
                  size="small"
                  sx={{
                    bgcolor: chipColor ? `${chipColor}20` : "primary.main20",
                    color: chipColor || "primary.main",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    border: `1px solid ${chipColor ? `${chipColor}40` : "primary.main40"}`,
                  }}
                />
              ))}
              {item.examples.length > 3 && (
                <Chip
                  label={`+${item.examples.length - 3} more`}
                  size="small"
                  sx={{
                    bgcolor: "action.hover",
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                />
              )}
            </Stack>
          )}
        </Box>

        <Box sx={{ mt: "auto", pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Created {formatDate(item.created_at)}
            </Typography>

            {item.updated_at && item.updated_at !== item.created_at && (
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                Updated {formatDate(item.updated_at)}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
