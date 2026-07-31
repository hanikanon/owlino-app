import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Timer } from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { RadioList } from "@/components/settings/rows";
import { useSettings, type AutoLockValue } from "@/components/settings/SettingsContext";
import { vibrateDevice } from "@/lib/native-feedback";

export const Route = createFileRoute("/settings/security/auto-lock")({
  component: Page,
});

const OPTIONS: { value: AutoLockValue; label: string; description?: string }[] = [
  {
    value: "immediate",
    label: "Immediately",
    description: "Lock as soon as the app is hidden",
  },
  { value: "30s", label: "After 30 seconds" },
  { value: "1m", label: "After 1 minute" },
  { value: "5m", label: "After 5 minutes" },
  { value: "10m", label: "After 10 minutes" },
  { value: "30m", label: "After 30 minutes" },
  { value: "never", label: "Never", description: "Not recommended" },
];

function Page() {
  const { prefs, setPref } = useSettings();
  return (
    <SettingsScreen title="Auto Lock">
      <div className="mx-6 mb-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
        <Timer size={14} className="mt-0.5 shrink-0" />
        <span>
          Automatically lock Cryptvora after a period of inactivity. You'll need to authenticate
          again to unlock.
        </span>
      </div>
      <SettingGroup>
        <RadioList
          value={prefs.autoLock}
          options={OPTIONS}
          onChange={(v) => {
            setPref("autoLock", v as import("@/components/settings/SettingsContext").AutoLockValue);
            vibrateDevice(15);
            toast(`Auto lock: ${OPTIONS.find((o) => o.value === v)?.label}`);
          }}
        />
      </SettingGroup>
    </SettingsScreen>
  );
}
