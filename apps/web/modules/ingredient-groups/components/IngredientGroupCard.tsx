import { formatDate } from "@/utils";
import { MoreVert } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import type { IngredientGroupWithExamples } from "@repo/schemas";
import type React from "react";

type IngredientGroupCardProps = {
  group: IngredientGroupWithExamples;
  onMenuClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    group: IngredientGroupWithExamples
  ) => void;
};

export function IngredientGroupCard({ group, onMenuClick }: IngredientGroupCardProps) {
  const totalIngredients = group.ingredientsCount || 0;
  const hasExamples = group.examples.length > 0;

  return (
    <Card>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
        }}
      >
        {/* Header */}
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: group.color,
                border: `2px solid ${group.color}40`,
                flexShrink: 0,
              }}
            />
            <Typography variant="h6">{group.name}</Typography>
          </Box>
          <IconButton size="small" onClick={(e) => onMenuClick(e, group)}>
            <MoreVert />
          </IconButton>
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: group.description ? "text.secondary" : "text.disabled",
            minHeight: "2.5em",
            flex: "0 0 auto",
          }}
        >
          {group.description || "No description provided"}
        </Typography>

        {/* Ingredient count only */}
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
          {totalIngredients} ingredient{totalIngredients !== 1 ? "s" : ""}
        </Typography>

        {/* Examples */}
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
              Add ingredients to see examples here
            </Typography>
          )}

          {hasExamples && (
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
              {group.examples.slice(0, 3).map((example) => (
                <Chip
                  key={example}
                  label={example}
                  size="small"
                  sx={{
                    bgcolor: `${group.color}20`,
                    color: group.color,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    border: `1px solid ${group.color}40`,
                  }}
                />
              ))}
              {group.examples.length > 3 && (
                <Chip
                  label={`+${group.examples.length - 3} more`}
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

        {/* Dates at the bottom */}
        <Box sx={{ mt: "auto", pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Created {formatDate(group.created_at)}
            </Typography>

            {group.updated_at && group.updated_at !== group.created_at && (
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                Updated {formatDate(group.updated_at)}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
