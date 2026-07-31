import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, useScroll, useMotionValueEvent, useMotionValue, useTransform } from "framer-motion";
import React, { useState, useRef } from "react";
import {
  Search,
  User,
  Shield,
  Bell,
  MessageSquare,
  Palette,
  Brush,
  Database,
  Lock,
  Smartphone,
  Globe,
  HelpCircle,
  Info,
  Sparkles,
  LogOut,
  Link2,
  FolderKanban,
  BatteryCharging,
} from "lucide-react";
import { ProfileHeader } from "@/components/settings/ProfileHeader";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { SettingItem } from "@/components/settings/SettingItem";
import { AvatarSheet } from "@/components/settings/AvatarSheet";
import { useSettings } from "@/components/settings/SettingsContext";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: SettingsIndex,
});

const ITEMS = [
  {
    path: "/settings/account",
    label: "Account",
    description: "Phone, email, username",
    icon: User,
    group: "Personal",
  },
  {
    path: "/settings/privacy",
    label: "Privacy",
    description: "Who can see your activity",
    icon: Shield,
    group: "Personal",
  },
  {
    path: "/settings/security",
    label: "Security",
    description: "2FA, passkeys, biometrics",
    icon: Lock,
    tint: "success" as const,
    group: "Personal",
  },
  {
    path: "/settings/social-links",
    label: "Social Links",
    description: "Telegram, X, Discord & more",
    icon: Link2,
    group: "Personal",
  },
  {
    path: "/settings/notifications",
    label: "Notifications",
    description: "Alerts, sounds, mentions",
    icon: Bell,
    group: "Experience",
  },
  {
    path: "/settings/chats",
    label: "Chats",
    description: "Auto-download, composer, backups",
    icon: MessageSquare,
    group: "Experience",
  },

  {
    path: "/settings/chat-wallpapers",
    label: "Chat Wallpapers",
    description: "Change chat background",
    icon: Palette,
    group: "Experience",
  },
  {
    path: "/settings/storage",
    label: "Storage & Data",
    description: "1.2 GB used · Auto-download",
    icon: Database,
    group: "Experience",
  },
  {
    path: "/settings/folders",
    label: "Folders",
    description: "Organize your chats",
    icon: FolderKanban,
    group: "Experience",
  },
  {
    path: "/settings/power",
    label: "Power Usage",
    description: "Battery & animations",
    icon: BatteryCharging,
    group: "Experience",
  },
  {
    path: "/settings/devices",
    label: "Linked Devices",
    description: "3 active sessions",
    icon: Smartphone,
    group: "System",
  },
  {
    path: "/settings/language",
    label: "Language",
    description: "Interface & region",
    icon: Globe,
    group: "System",
  },
  {
    path: "/settings/help",
    label: "Help & Support",
    description: "FAQ, contact us",
    icon: HelpCircle,
    group: "Support",
  },
  {
    path: "/settings/about",
    label: "About Cryptvora",
    description: "Version 1.0.0 · Terms · Privacy",
    icon: Info,
    group: "Support",
  },
];

function SettingsIndex() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const scrollYBounded = useMotionValue(0);
  const scrollYBoundedProgress = useTransform(scrollYBounded, [0, 80], [0, 1]);
  const headerY = useTransform(scrollYBoundedProgress, [0, 1], ["0%", "-100%"]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const diff = latest - previous;
    const current = scrollYBounded.get();
    if (latest <= 0) scrollYBounded.set(0);
    else scrollYBounded.set(Math.min(Math.max(current + diff, 0), 80));
  });
  const s = useSettings();
  const speed = 0.24;
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const navigate = useNavigate();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? ITEMS.filter(
        (i) => i.label.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
      )
    : null;

  const grouped: Record<string, typeof ITEMS> = {};
  (filtered ?? ITEMS).forEach((i) => {
    grouped[i.group] ||= [] as typeof ITEMS;
    grouped[i.group].push(i);
  });

  return (
    <div ref={scrollRef} className="h-full w-full overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
    <div className="mx-auto flex min-h-[100.1%] w-full max-w-[520px] flex-col md:max-w-[560px]">
      <motion.header
        style={{ 
          y: headerY,
          paddingTop: "max(env(safe-area-inset-top), 12px)", 
          willChange: "transform" 
        }}
        className="glass sticky top-0 z-20 flex items-center gap-2 px-4 py-3"
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
        >
          <Sparkles size={18} />
        </div>
        <h1 className="flex-1 truncate text-[17px] font-semibold tracking-tight text-foreground">
          Settings
        </h1>
      </motion.header>

      <main className="flex-1 pb-16 pt-4">
        <ProfileHeader
          onAvatarClick={() => setAvatarOpen(true)}
          onEditClick={() => navigate({ to: "/settings/edit-profile" })}
          onQrClick={() => navigate({ to: "/settings/qr" })}
        />

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: speed || 0.01 }}
          className="mx-3 mb-5"
        >
          <div className="flex items-center gap-2 rounded-xl bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] px-3 py-2">
            <Search size={15} className="text-muted-foreground" strokeWidth={2.2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search settings"
              className="w-full bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </motion.div>

        {Object.entries(grouped).map(([label, items], gi) => (
          <SettingGroup key={label} label={label} delay={0.05 + gi * 0.04}>
            {items.map((it, idx) => (
              <SettingItem
                key={it.path}
                icon={it.icon}
                label={it.label}
                description={it.description}
                tint={it.tint}
                onClick={() => navigate({ to: it.path })}
                last={idx === items.length - 1}
              />
            ))}
          </SettingGroup>
        ))}

        {filtered && filtered.length === 0 && (
          <p className="mx-6 mt-6 text-center text-[13px] text-muted-foreground">
            No settings match "{query}"
          </p>
        )}

        {!filtered && (
          <>
            <SettingGroup delay={0.25}>
              <SettingItem
                icon={LogOut}
                label="Sign out"
                danger
                showArrow={false}
                last
                onClick={() =>
                  toast("Signed out", {
                    description: "You've been signed out of this device.",
                  })
                }
              />
            </SettingGroup>
            <p className="mt-2 text-center text-[11.5px] text-muted-foreground">
              Cryptvora · Built for traders
            </p>
          </>
        )}
      </main>

      <AvatarSheet
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        onAction={(a) =>
          toast(
            a === "view" ? "Opening photo…" : a === "remove" ? "Photo removed" : "Photo updated",
          )
        }
      />
    </div>
    </div>
  );
}
