import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Github, Heart, Info, Shield, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { SettingItem } from "@/components/settings/SettingItem";
import { InfoRow } from "@/components/settings/rows";

export const Route = createFileRoute("/settings/about")({
  component: Page,
});

function Page() {
  return (
    <SettingsScreen title="About">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="mx-3 mb-6 flex flex-col items-center rounded-3xl border border-border bg-surface/70 p-8 text-center backdrop-blur-xl"
      >
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Sparkles size={26} />
        </div>
        <h2 className="text-[20px] font-semibold text-foreground">Cryptvora</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">Version 1.0.0 (build 2026.7)</p>
        <p className="mt-4 max-w-[280px] text-[12.5px] text-muted-foreground">
          A premium community platform built for traders. Private by default, fast by design.
        </p>
      </motion.div>

      <SettingGroup label="Build info">
        <InfoRow label="Version" value="1.0.0" />
        <InfoRow label="Build" value="2026.7.1547" />
        <InfoRow label="Channel" value="Stable" />
        <InfoRow label="License" value="Proprietary" />
      </SettingGroup>

      <SettingGroup label="Legal">
        <SettingItem icon={Info} label="Terms of service" onClick={() => toast("Opening terms…")} />
        <SettingItem
          icon={Shield}
          label="Privacy policy"
          onClick={() => toast("Opening privacy policy…")}
        />
        <SettingItem
          icon={Info}
          label="Open source licenses"
          onClick={() => toast("Loading licenses…")}
          last
        />
      </SettingGroup>

      <SettingGroup label="Community">
        <SettingItem
          icon={Star}
          label="Rate Cryptvora"
          description="Share your feedback in the app store"
          onClick={() => toast("Thanks for the love!")}
        />
        <SettingItem
          icon={Github}
          label="Follow on GitHub"
          trailing="@cryptvora"
          onClick={() => toast("Opening GitHub…")}
          last
        />
      </SettingGroup>

      <p className="mt-6 flex items-center justify-center gap-1 text-[12px] text-muted-foreground">
        Made with <Heart size={12} className="text-destructive" /> for traders worldwide.
      </p>
    </SettingsScreen>
  );
}
