import { PageHeader } from "@/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Customize your account preferences, notification settings, and app configuration.",
};

export default async function UserSettings() {
  return (
    <div>
      <PageHeader.Root
        title="Settings"
        description="Manage your account preferences and application settings"
      />
    </div>
  );
}
