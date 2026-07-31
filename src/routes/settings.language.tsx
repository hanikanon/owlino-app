import { createFileRoute } from "@tanstack/react-router";
import { Clock, Globe, Languages, MapPin, MessagesSquare } from "lucide-react";
import { toast } from "sonner";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { RadioList, RowChoice, RowToggle } from "@/components/settings/rows";
import { useSettings } from "@/components/settings/SettingsContext";

export const Route = createFileRoute("/settings/language")({
  component: Page,
});

const LANGUAGES = [
  { value: "English", label: "English", description: "English (US)" },
  { value: "Français", label: "Français", description: "French" },
  { value: "Español", label: "Español", description: "Spanish" },
  { value: "Deutsch", label: "Deutsch", description: "German" },
  { value: "Português", label: "Português", description: "Portuguese" },
  { value: "العربية", label: "العربية", description: "Arabic" },
  { value: "中文", label: "中文", description: "Chinese (Simplified)" },
  { value: "日本語", label: "日本語", description: "Japanese" },
];

const REGIONS = [
  { value: "Portugal" as const, label: "Portugal" },
  { value: "United States" as const, label: "United States" },
  { value: "United Kingdom" as const, label: "United Kingdom" },
  { value: "Germany" as const, label: "Germany" },
  { value: "Japan" as const, label: "Japan" },
];

const TIME = [
  { value: "24h" as const, label: "24-hour" },
  { value: "12h" as const, label: "12-hour" },
];

function Page() {
  const { prefs, setPref } = useSettings();
  return (
    <SettingsScreen title="Language">
      <SettingGroup label="Translate messages">
        <RowToggle
          icon={Languages}
          label="Show translate button"
          description="Appears when you tap a text message"
          checked={prefs.translateButton}
          onChange={(v) => setPref("translateButton", v)}
        />
        <RowToggle
          icon={MessagesSquare}
          label="Translate entire chat"
          description="Auto-translate incoming messages"
          checked={prefs.translateEntireChat}
          onChange={(v) => setPref("translateEntireChat", v)}
          last
        />
      </SettingGroup>

      <SettingGroup label="Interface language">
        <RadioList
          value={prefs.language}
          options={LANGUAGES}
          onChange={(v) => {
            setPref("language", v);
            toast.success(`Language set to ${v}`);
          }}
        />
      </SettingGroup>

      <SettingGroup label="Region & format">
        <RowChoice
          icon={MapPin}
          label="Region"
          value={prefs.region as (typeof REGIONS)[number]["value"]}
          options={REGIONS}
          onChange={(v) => setPref("region", v)}
        />
        <RowChoice
          icon={Clock}
          label="Time format"
          value={prefs.timeFormat}
          options={TIME}
          onChange={(v) => setPref("timeFormat", v as "24h" | "12h")}
          last
        />
      </SettingGroup>

      <div className="mx-6 mt-2 flex items-start gap-2 text-[12.5px] text-muted-foreground">
        <Globe size={14} className="mt-0.5 shrink-0" />
        <span>
          Help translate Cryptvora into your language — contact support to join our translator
          program.
        </span>
      </div>
    </SettingsScreen>
  );
}
