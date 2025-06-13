import { AIChatButton } from "@/modules/ai-nutrition";
import { DESKTOP_APP_NAVIGATION_DRAWER_WIDTH, Navigation } from "@/modules/navigation";
import { Box } from "@mui/material";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <div>
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
    </div>
  );
}
