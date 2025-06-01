import type React from "react";
import { Box, Typography, Card, CardContent, IconButton, Chip, Stack } from "@mui/material";
import { MoreVert, LocalOffer, Add } from "@mui/icons-material";
import type { MealTagWithExamples } from "@repo/schemas";

type MealTagCardProps = {
  tag: MealTagWithExamples;
  onMenuClick: (event: React.MouseEvent<HTMLButtonElement>, tag: MealTagWithExamples) => void;
  onAddMeal?: (tag: MealTagWithExamples) => void;
};

export function MealTagCard({ tag, onMenuClick, onAddMeal }: MealTagCardProps) {
  return (
    <Card
      sx={{
        position: "relative",
        transition: "all 0.2s ease-in-out",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          borderColor: tag.color || "primary.main",
          transform: "translateY(-2px)",
          boxShadow: tag.color ? `0 8px 25px ${tag.color}20` : "0 8px 25px rgba(139, 92, 246, 0.2)",
        },
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
              <LocalOffer sx={{ fontSize: 18, color: "text.secondary" }} />
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {tag.name}
            </Typography>
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
            <IconButton
              size="small"
              onClick={(e) => onMenuClick(e, tag)}
              sx={{
                opacity: 0.7,
                "&:hover": { opacity: 1 },
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: tag.description ? "text.secondary" : "text.disabled",
            minHeight: "2em",
            mb: 1,
          }}
        >
          {tag.description || "No description provided"}
        </Typography>

        {/* Meal Examples */}
        {tag.examples.length === 0 ? (
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              fontStyle: "italic",
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
                label={`+${tag.examples.length - 3}`}
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
      </CardContent>
    </Card>
  );
}
