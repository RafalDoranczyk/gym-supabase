import { formatDate } from "@/utils";
import { Add, LocalOffer, MoreVert } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import type { MealTagWithExamples } from "@repo/schemas";
import type React from "react";

type MealTagCardProps = {
  tag: MealTagWithExamples;
  onMenuClick: (event: React.MouseEvent<HTMLButtonElement>, tag: MealTagWithExamples) => void;
  onAddMeal?: (tag: MealTagWithExamples) => void;
};

export function MealTagCard({ tag, onMenuClick, onAddMeal }: MealTagCardProps) {
  const totalMeals = tag.mealsCount || 0;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: tag.color || "primary.main",
          transform: "translateY(-2px)",
          boxShadow: tag.color ? `0 8px 25px ${tag.color}20` : "0 8px 25px rgba(139, 92, 246, 0.2)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {tag.color ? (
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: tag.color,
                  border: `2px solid ${tag.color}40`,
                  flexShrink: 0,
                }}
              />
            ) : (
              <LocalOffer sx={{ fontSize: 16, color: "text.secondary" }} />
            )}
            <Typography variant="h6">{tag.name}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {onAddMeal && (
              <IconButton
                size="small"
                sx={{
                  color: tag.color || "primary.main",
                  "&:hover": {
                    bgcolor: tag.color ? `${tag.color}10` : "primary.main10",
                  },
                }}
                onClick={() => onAddMeal(tag)}
                title="Add meal with this tag"
              >
                <Add fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={(e) => onMenuClick(e, tag)}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: tag.description ? "text.secondary" : "text.disabled",
            minHeight: "2.5em",
            flex: "0 0 auto",
          }}
        >
          {tag.description || "No description provided"}
        </Typography>

        {/* Meals count */}
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
          {totalMeals} meal{totalMeals !== 1 ? "s" : ""}
        </Typography>

        {/* Examples */}
        <Box sx={{ flex: 1 }}>
          {tag.examples.length === 0 ? (
            <Typography
              variant="caption"
              sx={{
                color: "text.disabled",
                fontStyle: "italic",
                display: "block",
                py: 1,
              }}
            >
              Add meals to see examples here
            </Typography>
          ) : (
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
              {tag.examples.slice(0, 3).map((example) => (
                <Chip
                  key={example}
                  label={example}
                  size="small"
                  sx={{
                    bgcolor: tag.color ? `${tag.color}20` : "primary.main20",
                    color: tag.color || "primary.main",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    border: `1px solid ${tag.color ? `${tag.color}40` : "primary.main40"}`,
                  }}
                />
              ))}
              {tag.examples.length > 3 && (
                <Chip
                  label={`+${tag.examples.length - 3} more`}
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
              Created {formatDate(tag.created_at)}
            </Typography>

            {tag.updated_at && tag.updated_at !== tag.created_at && (
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                Updated {formatDate(tag.updated_at)}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
