import { createFileRoute } from "@tanstack/react-router";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { QRScreen } from "@/components/settings/QRScreen";

export const Route = createFileRoute("/settings/qr")({
  component: Page,
});

function Page() {
  return (
    <SettingsScreen title="My QR Code">
      <QRScreen />
    </SettingsScreen>
  );
}
