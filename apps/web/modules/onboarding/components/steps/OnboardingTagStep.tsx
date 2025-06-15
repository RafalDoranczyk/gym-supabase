import type { CreateMealTagPayload } from "@/modules/meal-tag";
import { CheckCircle } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import { MEAL_STARTER_TAGS } from "../../constants";

type OnboardingTagStepProps = {
  selectedTags: CreateMealTagPayload[];
  onSelectionChange: (selected: CreateMealTagPayload[]) => void;
};

export function OnboardingTagStep({ selectedTags, onSelectionChange }: OnboardingTagStepProps) {
  const handleTagToggle = (tagName: string) => {
    const isSelected = selectedTags.some((tag) => tag.name === tagName);
    const newSelection = isSelected
      ? selectedTags.filter((tag) => tag.name !== tagName)
      : [...selectedTags, ...MEAL_STARTER_TAGS.filter((tag) => tag.name === tagName)];

    onSelectionChange(newSelection);
  };

  // Helper function to check if tag is selected
  const isTagSelected = (tag: CreateMealTagPayload) => {
    return selectedTags.some((selectedTag) => selectedTag.name === tag.name);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Select Meal Tags
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Choose tags to help organize and filter your meals.
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2}>
        {MEAL_STARTER_TAGS.map((tag) => {
          const isSelected = isTagSelected(tag);

          return (
            <Chip
              key={tag.name}
              label={tag.name}
              variant={isSelected ? "filled" : "outlined"}
              clickable
              onClick={() => handleTagToggle(tag.name)}
              icon={isSelected ? <CheckCircle /> : undefined}
              sx={{
                color: tag.color,
                fontSize: "0.9rem",
                height: 40,
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
