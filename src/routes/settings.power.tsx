import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BatteryCharging,
  Film,
  Gauge,
  Image as ImageIcon,
  PhoneCall,
  Smile,
  Sparkle,
  Sticker,
  Wand2,
  Zap,
  ChevronDown,
} from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { RowToggle } from "@/components/settings/rows";
import { useSettings } from "@/components/settings/SettingsContext";

export const Route = createFileRoute("/settings/power")({
  component: Page,
});

function Page() {
  const { prefs, setPref } = useSettings();
  const modeLabel =
    prefs.lowPowerMode === "on"
      ? "ON"
      : prefs.lowPowerMode === "off"
        ? "OFF"
        : `Below ${prefs.lowPowerThreshold}%`;

  return (
    <SettingsScreen title="Power Usage">
      <SettingGroup
        label="Low power mode"
        footer="Automatically reduce power usage and animations when your battery is below 10%."
      >
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: "color-mix(in oklab, var(--primary) 14%, transparent)",
                  color: "var(--primary)",
                }}
              >
                <BatteryCharging size={18} />
              </span>
              <p className="text-[14.5px] font-semibold text-foreground">Low power mode</p>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-bold"
              style={{
                background:
                  prefs.lowPowerMode === "on"
                    ? "color-mix(in oklab, var(--primary) 20%, transparent)"
                    : "color-mix(in oklab, var(--foreground) 8%, transparent)",
                color: prefs.lowPowerMode === "on" ? "var(--primary)" : "var(--muted-foreground)",
              }}
            >
              {modeLabel}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11.5px] text-muted-foreground">
            <span>Off</span>
            <span>Below {prefs.lowPowerThreshold}%</span>
            <span>On</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={
              prefs.lowPowerMode === "off"
                ? 0
                : prefs.lowPowerMode === "on"
                  ? 100
                  : prefs.lowPowerThreshold
            }
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v === 0) setPref("lowPowerMode", "off");
              else if (v === 100) setPref("lowPowerMode", "on");
              else {
                setPref("lowPowerMode", "auto");
                setPref("lowPowerThreshold", v);
              }
            }}
            className="mt-2 w-full accent-[var(--primary)]"
          />
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            Automatically reduce power usage and animations when your battery drops below the
            selected level.
          </p>
        </div>
      </SettingGroup>

      <SettingGroup
        label="Power saving options"
        footer="You can disable animated transitions between different sections of the app."
      >
        <RowToggle
          icon={Sticker}
          label="Animated Stickers"
          trailing={
            <span className="text-[12px] text-muted-foreground mr-1 flex items-center gap-1">
              <span className="opacity-60">2/2</span> <ChevronDown size={14} />
            </span>
          }
          checked={prefs.animatedStickers}
          onChange={(v) => setPref("animatedStickers", v)}
        />
        <RowToggle
          icon={Smile}
          label="Animated Emoji"
          trailing={
            <span className="text-[12px] text-muted-foreground mr-1 flex items-center gap-1">
              <span className="opacity-60">1/3</span> <ChevronDown size={14} />
            </span>
          }
          checked={prefs.animatedEmoji}
          onChange={(v) => setPref("animatedEmoji", v)}
        />
        <RowToggle
          icon={Wand2}
          label="Animations in Chats"
          trailing={
            <span className="text-[12px] text-muted-foreground mr-1 flex items-center gap-1">
              <span className="opacity-60">2/6</span> <ChevronDown size={14} />
            </span>
          }
          checked={prefs.chatEffects}
          onChange={(v) => setPref("chatEffects", v)}
        />
        <RowToggle
          icon={PhoneCall}
          label="Animations in Calls"
          checked={prefs.callAnimations}
          onChange={(v) => setPref("callAnimations", v)}
        />
        <RowToggle
          icon={Film}
          label="Autoplay Videos"
          checked={prefs.autoplayVideos}
          onChange={(v) => setPref("autoplayVideos", v)}
        />
        <RowToggle
          icon={ImageIcon}
          label="Autoplay GIFs"
          checked={prefs.autoplayGifs}
          onChange={(v) => setPref("autoplayGifs", v)}
        />
        <RowToggle
          icon={Sparkle}
          label="Particles"
          checked={prefs.particles}
          onChange={(v) => setPref("particles", v)}
          last
        />
      </SettingGroup>

      <SettingGroup label="Transitions">
        <RowToggle
          icon={Zap}
          label="Enable Smooth Transitions"
          description="Disable to remove animated transitions between sections"
          checked={prefs.smoothTransitions}
          onChange={(v) => setPref("smoothTransitions", v)}
          last
        />
      </SettingGroup>

      <div className="mx-6 mt-2 flex items-start gap-2 text-[12.5px] text-muted-foreground">
        <Gauge size={14} className="mt-0.5 shrink-0" />
        <span>Turning these off may improve battery life on older devices.</span>
      </div>
    </SettingsScreen>
  );
}
