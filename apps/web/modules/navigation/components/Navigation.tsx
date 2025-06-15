import { Box } from "@mui/material";
import { DesktopNavigation } from "./DesktopNavigation/DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation/MobileNavigation";

// I can't use useMediaQuery hook here to detect what drawer to use cause it always returns false at first render
// https://github.com/mui/material-ui/pull/36056
// That's why I'm using two different components for mobile and desktop
export function Navigation() {
  return (
    <>
      <Box sx={{ display: { lg: "none", xs: "block" } }}>
        <MobileNavigation />
      </Box>
      <Box sx={{ display: { lg: "block", xs: "none" } }}>
        <DesktopNavigation />
      </Box>
    </>
  );
}
