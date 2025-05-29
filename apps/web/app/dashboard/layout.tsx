import { DESKTOP_APP_NAVIGATION_DRAWER_WIDTH, Navigation } from "@/modules/navigation";
import { Box } from "@mui/material";
import type { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navigation />
      <Box
        ml={{
          lg: DESKTOP_APP_NAVIGATION_DRAWER_WIDTH,
        }}
        mt={8}
        p={4}
      >
        {children}
      </Box>
    </>
  );
}
