import { Drawer } from "@mui/material";
import type { PropsWithChildren } from "react";

type MobileNavigationDrawerProps = {
  onClose: () => void;
  open: boolean;
};

export function MobileNavigationDrawer({
  children,
  onClose,
  open,
}: PropsWithChildren<MobileNavigationDrawerProps>) {
  return (
    <Drawer onClose={onClose} open={open} variant="temporary">
      {children}
    </Drawer>
  );
}
