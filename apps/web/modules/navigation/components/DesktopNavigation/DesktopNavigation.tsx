import { NavigationLinks } from "../NavigationLinks";
import { DesktopNavigationBar } from "./DesktopNavigationBar";
import { DesktopNavigationDrawer } from "./DesktopNavigationDrawer";

export function DesktopNavigation() {
  return (
    <>
      <DesktopNavigationBar />
      <DesktopNavigationDrawer>
        <NavigationLinks />
      </DesktopNavigationDrawer>
    </>
  );
}
