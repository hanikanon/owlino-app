import { createFileRoute, useRouter } from "@tanstack/react-router";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { EditProfileScreen } from "@/components/settings/EditProfileScreen";

export const Route = createFileRoute("/settings/edit-profile")({
  component: Page,
});

function Page() {
  const router = useRouter();
  return (
    <SettingsScreen title="Edit Profile">
      <EditProfileScreen onDone={() => router.history.back()} />
    </SettingsScreen>
  );
}
