"use client";

import { useState } from "react";

import { NavigationLinks } from "../NavigationLinks/NavigationLinks";
import { MobileNavigationBar } from "./MobileNavigationBar";
import { MobileNavigationDrawer } from "./MobileNavigationDrawer";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  return (
    <>
      <MobileNavigationBar toggleOpen={handleToggle} />
      <MobileNavigationDrawer onClose={handleClose} open={open}>
        <NavigationLinks />
      </MobileNavigationDrawer>
    </>
  );
}
