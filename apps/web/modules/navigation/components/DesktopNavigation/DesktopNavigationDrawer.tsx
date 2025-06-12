import { getUser } from "@/actions";
import { APP_NAME } from "@/constants";
import { Box, Drawer, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";

export const DESKTOP_APP_NAVIGATION_DRAWER_WIDTH = "220px";
export const APP_BAR_HEIGHT = 64;

export async function DesktopNavigationDrawer({ children }: PropsWithChildren) {
  const user = await getUser();

  return (
    <Drawer
      aria-label="Main navigation"
      sx={{
        "& .MuiDrawer-paper": { width: DESKTOP_APP_NAVIGATION_DRAWER_WIDTH },
      }}
      variant="permanent"
    >
      <Box
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        height={APP_BAR_HEIGHT}
        justifyContent="center"
        pl={2}
        sx={{ cursor: "default" }}
      >
        <Typography variant="button">{APP_NAME}</Typography>
        <Typography variant="caption">
          {user?.user_metadata?.user_name ?? "Unknown user"}
        </Typography>
      </Box>
      {children}
    </Drawer>
  );
}
