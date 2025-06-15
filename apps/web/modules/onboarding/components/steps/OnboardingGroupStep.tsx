import type { CreateIngredientGroupPayload } from "@/modules/ingredient-group";
import { Category, CheckCircle, RestaurantMenu } from "@mui/icons-material";
import { Avatar, Badge, Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import {
  getStarterIngredientsByGroup,
  INGREDIENT_STARTER_GROUPS,
  POPULAR_INGREDIENT_GROUPS,
} from "../../constants";

type OnboardingGroupStepProps = {
  selectedGroups: CreateIngredientGroupPayload[];
  onSelectionChange: (selected: CreateIngredientGroupPayload[]) => void;
};

export function OnboardingGroupStep({
  selectedGroups,
  onSelectionChange,
}: OnboardingGroupStepProps) {
  const handleGroupToggle = (name: string) => {
    const selectedNames = selectedGroups.map((group) => group.name);
    const newSelectedNames = selectedNames.includes(name)
      ? selectedNames.filter((selectedName) => selectedName !== name)
      : [...selectedNames, name];

    const newSelection = INGREDIENT_STARTER_GROUPS.filter((group) =>
      newSelectedNames.includes(group.name)
    );
    onSelectionChange(newSelection);
  };

  const isGroupSelected = (group: CreateIngredientGroupPayload) => {
    return selectedGroups.some((selected) => selected.name === group.name);
  };

  const getIngredientCount = (groupName: string) => {
    const ingredients = getStarterIngredientsByGroup(groupName);
    return ingredients.length;
  };

  const getTotalSelectedIngredients = () => {
    return selectedGroups.reduce((total, group) => {
      return total + getIngredientCount(group.name);
    }, 0);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Select Ingredient Groups
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={2}>
        Organize ingredients into categories for faster recipe creation.
      </Typography>

      {/* Summary */}
      {selectedGroups.length > 0 && (
        <Box
          sx={{
            p: 2,
            mb: 4,
            bgcolor: "primary.dark",
            borderRadius: 2,
            border: 1,
            borderColor: "primary.200",
          }}
        >
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{
              color: (p) => p.palette.getContrastText(p.palette.primary.dark),
            }}
          >
            {selectedGroups.length} categories selected • {getTotalSelectedIngredients()}{" "}
            ingredients will be added
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {INGREDIENT_STARTER_GROUPS.map((group) => {
          const isSelected = isGroupSelected(group);
          const ingredientCount = getIngredientCount(group.name);

          return (
            <Grid
              key={group.name}
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Card
                variant={isSelected ? "elevation" : "outlined"}
                elevation={isSelected ? 4 : 0}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  border: 2,
                  borderColor: isSelected ? group.color : "divider",
                  position: "relative",
                  "&:hover": {
                    borderColor: group.color,
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px ${group.color}20`,
                  },
                }}
                onClick={() => handleGroupToggle(group.name)}
              >
                {/* Selection badge */}
                {isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 1,
                    }}
                  >
                    <Badge badgeContent={<CheckCircle sx={{ fontSize: 16 }} />} color="primary" />
                  </Box>
                )}

                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: group.color,
                        width: 48,
                        height: 48,
                        color: "white",
                      }}
                    >
                      <Category />
                    </Avatar>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {group.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {group.description}
                      </Typography>

                      {/* Ingredient count chip */}
                      <Box display="flex" gap={1} alignItems="center">
                        <Chip
                          icon={<RestaurantMenu />}
                          label={`${ingredientCount} ingredients`}
                          size="small"
                          variant={isSelected ? "filled" : "outlined"}
                          sx={{
                            bgcolor: isSelected ? group.color : "transparent",
                            color: isSelected ? "white" : group.color,
                            borderColor: group.color,
                            fontWeight: "medium",
                          }}
                        />

                        {/* Popular badge for certain groups */}
                        {POPULAR_INGREDIENT_GROUPS.includes(group.name) && (
                          <Chip
                            label="Popular"
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.7rem",
                              height: 20,
                              color: "success.main",
                              borderColor: "success.main",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Help text */}
      <Box mt={3} textAlign="center">
        <Typography variant="caption" color="text.secondary">
          💡 Tip: You can always add more groups and ingredients later in the Library section
        </Typography>
      </Box>
    </div>
  );
}
