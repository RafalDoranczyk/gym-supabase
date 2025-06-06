import { PageHeader } from "@/components";
import { SettingsPageContent } from "@/modules/user-settings";
import { Stack } from "@mui/material";

export default function SettingsPage() {
  return (
    <Stack spacing={4}>
      <PageHeader
        title="Settings"
        description="Manage your account preferences and application settings"
      />

      <SettingsPageContent />
    </Stack>
  );
}
