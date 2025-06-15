import { AIChatButton } from "@/modules/ai-nutrition";
import { DESKTOP_APP_NAVIGATION_DRAWER_WIDTH, Navigation } from "@/modules/navigation";
import { Box } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal nutrition and fitness tracking hub.",
};

export default function DashboardLayout({ children }: React.PropsWithChildren) {
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
        <AIChatButton />
      </Box>
    </>
  );
}
