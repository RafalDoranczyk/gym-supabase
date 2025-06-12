"use client";

import { PATHS } from "@/constants";
import {
  BookRounded,
  CalendarTodayRounded,
  DashboardRounded,
  DinnerDiningRounded,
  MonitorWeightRounded,
  RestaurantRounded,
  SettingsApplications,
} from "@mui/icons-material";
import { Box, List, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAVIGATION_MODULES: NavigationSection[] = [
  {
    elements: [
      {
        icon: <DashboardRounded />,
        id: "dashboard",
        text: "Dashboard",
        to: PATHS.DASHBOARD,
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
        to: PATHS.MEASUREMENTS,
      },
    ],
    title: "tracking",
  },
  {
    elements: [
      {
        icon: <CalendarTodayRounded />,
        id: "food-diary",
        text: "Food Diary",
        to: PATHS.NUTRITION.FOOD_DIARY,
      },
    ],
    title: "nutrition",
  },
  {
    elements: [
      {
        icon: <BookRounded />,
        id: "library",
        text: "Library",
        to: PATHS.LIBRARY.ROOT,
      },
      {
        icon: <RestaurantRounded />,
        id: "ingredients",
        text: "Ingredients",
        to: PATHS.LIBRARY.INGREDIENTS,
      },
      {
        icon: <DinnerDiningRounded />,
        id: "meals",
        text: "Meals",
        to: PATHS.LIBRARY.MEALS,
      },
    ],
    title: "library",
  },
  {
    elements: [
      {
        icon: <SettingsApplications />,
        id: "settings",
        to: PATHS.SETTINGS,
        text: "Settings",
      },
    ],
    title: "Profile",
  },
] as const;

// Helper function dla linków w komponentach
export const createLibraryPath = (section: string) => `${PATHS.LIBRARY.ROOT}/${section}`;

// Type safety
type LibrarySection = "ingredients" | "meals" | "exercises";
export const getLibraryPath = (section: LibrarySection) => {
  const pathMap = {
    ingredients: PATHS.LIBRARY.INGREDIENTS,
    meals: PATHS.LIBRARY.MEALS,
    exercises: `${PATHS.LIBRARY.ROOT}/exercises`, // future
  };
  return pathMap[section];
};

// Rest of navigation component stays the same...
const SECTION_TITLE_STYLES = {
  color: "text.secondary",
  cursor: "default",
  fontSize: 12,
  fontWeight: 700,
  pl: 2,
  textTransform: "uppercase",
} as const;

export type NavigationLinkElementProps = {
  icon: ReactNode;
  id: string;
  text: string;
  to: string;
};

type NavigationSection = {
  elements: NavigationLinkElementProps[];
  title: string;
};

function NavigationLinkElement({ icon, text, to }: NavigationLinkElementProps) {
  const pathname = usePathname();

  const isSelected = (current: string, target: string) => {
    return target === PATHS.DASHBOARD ? current === target : current.includes(target);
  };

  const selected = isSelected(pathname, to);

  return (
    <ListItemButton component={Link} href={to} selected={selected} sx={{ textDecoration: "none" }}>
      <ListItemIcon
        sx={{
          svg: {
            color: ({ palette }) => (selected ? palette.primary.main : "unset"),
            height: 20,
          },
        }}
      >
        {icon}
      </ListItemIcon>
      <Typography color="textPrimary" fontWeight={selected ? "bold" : "normal"} variant="subtitle2">
        {text}
      </Typography>
    </ListItemButton>
  );
}

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
