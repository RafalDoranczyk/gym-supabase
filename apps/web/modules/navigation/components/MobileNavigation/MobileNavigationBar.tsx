import { AppBar, Box, Toolbar } from "@mui/material";
import { NavigationActionButtons } from "../NavigationActionButtons";
import MobileDrawerToggler from "./MobileDrawerToggler";

type MobileNavigationBarProps = {
  toggleOpen: () => void;
};

export function MobileNavigationBar({ toggleOpen }: MobileNavigationBarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "background.default",
      }}
    >
      <Toolbar>
        <MobileDrawerToggler toggleOpen={toggleOpen} />
        <Box ml="auto" />
        <NavigationActionButtons />
      </Toolbar>
    </AppBar>
  );
}
