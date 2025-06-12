import { PageHeader } from "@/components";
import { UserSettingsPageContent, fetchUserPreferences } from "@/modules/user-settings";

export default async function UserSettingsPage() {
  const preferences = await fetchUserPreferences();

  return (
    <div>
      <PageHeader.Root
        title="Settings"
        description="Manage your account preferences and application settings"
      />
      <UserSettingsPageContent preferences={preferences} />
    </div>
  );
}
