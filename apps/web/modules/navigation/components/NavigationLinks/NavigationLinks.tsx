import {
  DashboardRounded,
  DinnerDiningRounded,
  EggRounded,
  FoodBankRounded,
  MenuBookRounded,
  ScaleRounded,
} from "@mui/icons-material";
import { Box, List, Typography } from "@mui/material";

import { NavigationLinkElement, type NavigationLinkElementProps } from "./NavigationLinkElement";

type NavigationSection = {
  elements: NavigationLinkElementProps[];
  title: string;
};

const modules: NavigationSection[] = [
  {
    elements: [
      {
        icon: <DashboardRounded />,
        id: "dashboard",
        text: "Dashboard",
        to: "/dashboard",
      },
    ],
    title: "dashboard",
  },
  {
    elements: [
      {
        icon: <ScaleRounded />,
        id: "measurements",
        text: "Measurements",
        to: "/dashboard/measurements",
      },
      {
        icon: <MenuBookRounded />,
        id: "eating",
        text: "Eating",
        to: "/dashboard/eating",
      },
    ],
    title: "diary",
  },
  {
    elements: [
      {
        icon: <EggRounded />,
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
      {
        icon: <FoodBankRounded />,
        id: "eating-day-plans",
        text: "Day plans",
        to: "/dashboard/plans",
      },
    ],
    title: "nutrition database",
  },
  {
    elements: [
      {
        icon: <FoodBankRounded />,
        id: "data-management",
        text: "Data management",
        to: "/dashboard/data-management",
      },
    ],
    title: "data-management",
  },
];

export function NavigationLinks() {
  return modules.map(({ elements, title }) => (
    <Box key={title} mt={3}>
      <Typography
        sx={{
          color: "text.secondary",
          cursor: "default",
          fontSize: 12,
          fontWeight: 700,
          pl: 2,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
      <List component="nav">
        {elements.map((props) => (
          <NavigationLinkElement key={props.id} {...props} />
        ))}
      </List>
    </Box>
  ));
}
