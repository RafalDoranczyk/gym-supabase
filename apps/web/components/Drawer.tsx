import {
  Box,
  Drawer as MaterialDrawer,
  type DrawerProps as MaterialDrawerProps,
  Typography,
} from "@mui/material";
import type { PropsWithChildren } from "react";

type DrawerRootProps = MaterialDrawerProps & {
  size: DrawerSizes;
};

type DrawerSizes = "lg" | "md" | "sm" | "xl";

const drawerSizes: Record<DrawerSizes, number> = {
  lg: 800,
  md: 600,
  sm: 400,
  xl: 1200,
};

function Root({
  children,
  size = "sm",
  title,
  ...drawerProps
}: PropsWithChildren<DrawerRootProps>) {
  return (
    <MaterialDrawer anchor="right" {...drawerProps}>
      <Box maxWidth={drawerSizes[size]} width="95vw">
        {children}
      </Box>
    </MaterialDrawer>
  );
}

function Title({ title }: { title: string }) {
  return (
    <Box alignItems="center" bgcolor="primary.dark" display="flex" minHeight={64}>
      <Typography component="h2" fontSize={16} ml={1.5} variant="button">
        {title}
      </Typography>
    </Box>
  );
}

export const Drawer = {
  Root,
  Title,
} as const;
