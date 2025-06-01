import type React from "react";
import { Box, Typography, Card, CardContent, IconButton, Chip, Stack } from "@mui/material";
import { MoreVert, Add } from "@mui/icons-material";
import type { NutritionGroupWithExamples } from "@repo/schemas";

type IngredientGroupCardProps = {
  group: NutritionGroupWithExamples;
  onMenuClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    group: NutritionGroupWithExamples,
  ) => void;
  onAddIngredient?: (group: NutritionGroupWithExamples) => void;
};

export function IngredientGroupCard({
  group,
  onMenuClick,
  onAddIngredient,
}: IngredientGroupCardProps) {
  return (
    <Card
      sx={{
        height: "100%", // Make card take full height
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: group.color,
          transform: "translateY(-2px)",
          boxShadow: `0 8px 25px ${group.color}20`,
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1, // Make content flexible
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
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {onAddIngredient && (
              <IconButton
                size="small"
                sx={{
                  color: group.color,
                  "&:hover": {
                    bgcolor: `${group.color}10`,
                  },
                }}
                onClick={() => onAddIngredient(group)}
                title="Add ingredient to this group"
              >
                <Add fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={(e) => onMenuClick(e, group)}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: group.description ? "text.secondary" : "text.disabled",
            minHeight: "3em", // Fixed min height for description
            flex: "0 0 auto",
          }}
        >
          {group.description || "No description provided"}
        </Typography>

        <Box sx={{ mt: "auto" }}>
          {" "}
          {/* Push examples to bottom */}
          {group.examples.length === 0 ? (
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
          ) : (
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
                  label={`+${group.examples.length - 3}`}
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
      </CardContent>
    </Card>
  );
}
