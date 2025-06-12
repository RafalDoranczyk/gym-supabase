import {
  Box,
  Drawer as MaterialDrawer,
  type DrawerProps as MaterialDrawerProps,
  Typography,
} from "@mui/material";
import type { PropsWithChildren } from "react";

type DrawerRootProps = MaterialDrawerProps & {
  size?: DrawerSizes;
};

type DrawerSizes = "lg" | "md" | "sm" | "xl";

const drawerSizes: Record<DrawerSizes, number> = {
  lg: 800,
  md: 600,
  sm: 400,
  xl: 1200,
};

function Root({ children, size = "sm", ...drawerProps }: PropsWithChildren<DrawerRootProps>) {
  return (
    <MaterialDrawer anchor="right" {...drawerProps}>
      <Box maxWidth={drawerSizes[size]} width="95vw">
        {children}
      </Box>
    </MaterialDrawer>
  );
}

function Header({ children }: PropsWithChildren) {
  return (
    <Box
      display="flex"
      alignItems="center"
      minHeight={64}
      px={2.5}
      borderBottom={1}
      borderColor="divider"
    >
      {children}
    </Box>
  );
}

function Title({ children }: PropsWithChildren) {
  return (
    <Typography component="h2" variant="h6" fontWeight={600}>
      {children}
    </Typography>
  );
}

function Content({ children }: PropsWithChildren) {
  return (
    <Box p={2.5} flex={1}>
      {children}
    </Box>
  );
}

function Footer({ children }: PropsWithChildren) {
  return (
    <Box p={2.5} borderTop={1} borderColor="divider">
      {children}
    </Box>
  );
}

export const Drawer = {
  Root,
  Header,
  Title,
  Content,
  Footer,
} as const;
