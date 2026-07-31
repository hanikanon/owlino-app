import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Database,
  Film,
  FileText,
  ImageIcon,
  Megaphone,
  Mic,
  RotateCcw,
  SmartphoneNfc,
  Trash2,
  User,
  Users,
  Wifi,
  Plane,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { SettingItem } from "@/components/settings/SettingItem";
import { RowToggle } from "@/components/settings/rows";
import { useSettings } from "@/components/settings/SettingsContext";

export const Route = createFileRoute("/settings/storage")({
  component: Page,
});

const CATS = [
  {
    icon: ImageIcon,
    label: "Photos",
    size: 612,
    color: "oklch(0.72 0.17 155)",
  },
  { icon: Film, label: "Videos", size: 420, color: "oklch(0.68 0.16 250)" },
  {
    icon: Mic,
    label: "Voice messages",
    size: 84,
    color: "oklch(0.74 0.18 340)",
  },
  {
    icon: FileText,
    label: "Documents",
    size: 96,
    color: "oklch(0.78 0.16 70)",
  },
];

function Page() {
  const { prefs, setPref } = useSettings();
  const [cache, setCache] = useState(248);
  const total = 16 * 1024; // 16 GB in MB
  const used = CATS.reduce((s, c) => s + c.size, 0) + cache;
  const pct = Math.min(100, (used / total) * 100);
  const resetAutoDownload = () => {
    setPref("autoDownloadOnMobile", false);
    setPref("autoDownloadWifi", true);
    setPref("autoDownloadRoaming", false);
    setPref("autoDownloadPhotos", true);
    setPref("autoDownloadVideos", false);
    setPref("autoDownloadFiles", false);
    toast.success("Auto-download settings reset");
  };
  return (
    <SettingsScreen title="Storage & Data">
      <SettingGroup label="Usage">
        <div className="p-5">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-wider text-muted-foreground">Used</p>
              <p className="text-[24px] font-semibold tracking-tight text-foreground">
                {(used / 1024).toFixed(2)}
                <span className="ml-1 text-[14px] text-muted-foreground">/ 16 GB</span>
              </p>
            </div>
            <p className="text-[13px] text-[var(--primary)]">{pct.toFixed(1)}%</p>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--foreground)_8%,transparent)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ background: "var(--gradient-brand)" }}
            />
          </div>
          <div className="mt-4 space-y-2.5">
            {CATS.map((c) => {
              const p = (c.size / total) * 100;
              return (
                <div key={c.label} className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      background: `color-mix(in oklab, ${c.color} 18%, transparent)`,
                      color: c.color,
                    }}
                  >
                    <c.icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[13.5px] text-foreground">
                      <span>{c.label}</span>
                      <span className="text-muted-foreground">{c.size} MB</span>
                    </div>
                    <div className="mt-1 h-1 w-full rounded-full bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${p}%`, background: c.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SettingGroup>

      <SettingGroup label="Automatic media download">
        <RowToggle
          icon={SmartphoneNfc}
          label="When using mobile data"
          checked={prefs.autoDownloadOnMobile}
          onChange={(v) => setPref("autoDownloadOnMobile", v)}
        />
        <RowToggle
          icon={Wifi}
          label="When connected on Wi-Fi"
          checked={prefs.autoDownloadWifi}
          onChange={(v) => setPref("autoDownloadWifi", v)}
        />
        <RowToggle
          icon={Plane}
          label="When roaming"
          checked={prefs.autoDownloadRoaming}
          onChange={(v) => setPref("autoDownloadRoaming", v)}
        />
        <SettingItem
          icon={RotateCcw}
          label="Reset auto-download settings"
          danger
          showArrow={false}
          last
          onClick={resetAutoDownload}
        />
      </SettingGroup>

      <SettingGroup label="Save to gallery">
        <RowToggle
          icon={User}
          label="Private chats"
          checked={prefs.saveToGalleryPrivate}
          onChange={(v) => setPref("saveToGalleryPrivate", v)}
        />
        <RowToggle
          icon={Users}
          label="Groups"
          checked={prefs.saveToGalleryGroups}
          onChange={(v) => setPref("saveToGalleryGroups", v)}
        />
        <RowToggle
          icon={Megaphone}
          label="Channels"
          checked={prefs.saveToGalleryChannels}
          onChange={(v) => setPref("saveToGalleryChannels", v)}
          last
        />
      </SettingGroup>

      <SettingGroup label="Cleanup">
        <SettingItem
          icon={Database}
          label="Clear cache"
          trailing={`${cache} MB`}
          showArrow={false}
          onClick={() => {
            setCache(0);
            toast("Cache cleared", {
              description: "Freed 248 MB of temporary files.",
            });
          }}
        />
        <SettingItem
          icon={Trash2}
          label="Delete all downloads"
          description="Remove cached photos, videos and files"
          danger
          showArrow={false}
          last
          onClick={() =>
            toast("Downloads deleted", {
              description: "1.09 GB reclaimed on this device.",
            })
          }
        />
      </SettingGroup>
    </SettingsScreen>
  );
}
