import {
  AnalyticsRounded,
  DashboardRounded,
  DinnerDiningRounded,
  MonitorWeightRounded,
  RestaurantRounded,
} from "@mui/icons-material";
import { Box, List, Typography } from "@mui/material";
import { NavigationLinkElement, type NavigationLinkElementProps } from "./NavigationLinkElement";

type NavigationSection = {
  elements: NavigationLinkElementProps[];
  title: string;
};

const NAVIGATION_MODULES: NavigationSection[] = [
  {
    elements: [
      {
        icon: <DashboardRounded />,
        id: "dashboard",
        text: "Dashboard",
        to: "/dashboard",
      },
    ],
    title: "overview",
  },
  {
    elements: [
      {
        icon: <MonitorWeightRounded />,
        id: "measurements",
        text: "Measurements",
        to: "/dashboard/measurements",
      },
    ],
    title: "tracking",
  },
  {
    elements: [
      {
        icon: <RestaurantRounded />,
        id: "ingredients",
        text: "Ingredients",
        to: "/dashboard/ingredients",
      },
      {
        icon: <DinnerDiningRounded />,
        id: "meals",
        text: "Meals",
        to: "/dashboard/meals",
      },
    ],
    title: "nutrition",
  },
  {
    elements: [
      {
        icon: <AnalyticsRounded />,
        id: "library",
        text: "Library",
        to: "/dashboard/library",
      },
    ],
    title: "library",
  },
] as const;

const SECTION_TITLE_STYLES = {
  color: "text.secondary",
  cursor: "default",
  fontSize: 12,
  fontWeight: 700,
  pl: 2,
  textTransform: "uppercase",
} as const;

export function NavigationLinks() {
  return (
    <>
      {NAVIGATION_MODULES.map(({ elements, title }) => (
        <Box key={title} mt={3}>
          <Typography sx={SECTION_TITLE_STYLES}>{title}</Typography>
          <List component="nav">
            {elements.map((props) => (
              <NavigationLinkElement key={props.id} {...props} />
            ))}
          </List>
        </Box>
      ))}
    </>
  );
}
