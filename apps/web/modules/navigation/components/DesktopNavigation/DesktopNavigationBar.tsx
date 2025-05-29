import { AppBar, Box, Toolbar } from "@mui/material";

import { DESKTOP_APP_NAVIGATION_DRAWER_WIDTH } from "../..";
import { NavigationActionButtons } from "../NavigationActionButtons";

export function DesktopNavigationBar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundImage: "none",
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: 0,

        pl: { lg: DESKTOP_APP_NAVIGATION_DRAWER_WIDTH },
        top: "var(--template-frame-height, 0px)",
      }}
    >
      <Toolbar>
        <Box ml="auto" />
        <NavigationActionButtons />
      </Toolbar>
    </AppBar>
  );
}
