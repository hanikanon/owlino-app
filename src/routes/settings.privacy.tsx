import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff, MessageSquare, User, Phone, Camera, Clock, ShieldOff } from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { RowChoice, RowToggle } from "@/components/settings/rows";
import { useSettings } from "@/components/settings/SettingsContext";

export const Route = createFileRoute("/settings/privacy")({
  component: Page,
});

const VIS = [
  { value: "everyone" as const, label: "Everyone" },
  { value: "contacts" as const, label: "My Contacts" },
  { value: "nobody" as const, label: "Nobody" },
];

const DISAPPEARING = [
  { value: "off" as const, label: "Off" },
  { value: "24h" as const, label: "24 hours" },
  { value: "7d" as const, label: "7 days" },
  { value: "30d" as const, label: "30 days" },
];

function Page() {
  const { prefs, setPref } = useSettings();
  return (
    <SettingsScreen title="Privacy">
      <SettingGroup label="Visibility">
        <RowChoice
          icon={User}
          label="Profile photo"
          value={prefs.profilePhotoVisibility}
          options={VIS}
          onChange={(v) => setPref("profilePhotoVisibility", v as unknown as any)}
        />
        <RowChoice
          icon={Phone}
          label="Phone number"
          value={prefs.phoneVisibility}
          options={VIS}
          onChange={(v) => setPref("phoneVisibility", v as unknown as any)}
          last
        />
      </SettingGroup>

      <SettingGroup label="Activity">
        <RowToggle
          icon={Eye}
          label="Read receipts"
          description="Show when you've read a message"
          checked={prefs.readReceipts}
          onChange={(v) => setPref("readReceipts", v)}
        />
        <RowToggle
          icon={EyeOff}
          label="Last seen"
          description="Share when you were last online"
          checked={prefs.lastSeen}
          onChange={(v) => setPref("lastSeen", v as unknown as any)}
        />
        <RowToggle
          icon={MessageSquare}
          label="Typing indicator"
          description="Signal while you're typing"
          checked={prefs.typingIndicator}
          onChange={(v) => setPref("typingIndicator", v)}
          last
        />
      </SettingGroup>

      <SettingGroup label="Chat security">
        <RowChoice
          icon={Clock}
          label="Disappearing messages"
          description="Default timer for new chats"
          value={prefs.disappearingMessages}
          options={DISAPPEARING}
          onChange={(v) => setPref("disappearingMessages", v as unknown as any)}
        />
        <RowToggle
          icon={Camera}
          label="Block screenshots"
          description="Prevent screenshots inside the app"
          checked={prefs.blockScreenshots}
          onChange={(v) => setPref("blockScreenshots", v)}
          last
        />
      </SettingGroup>

      <SettingGroup label="Blocked users">
        <div className="flex items-center gap-3 px-4 py-4 text-[13.5px] text-muted-foreground">
          <ShieldOff size={16} /> You haven't blocked anyone yet.
        </div>
      </SettingGroup>
    </SettingsScreen>
  );
}
