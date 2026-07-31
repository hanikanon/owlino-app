import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AtSign, Check, ExternalLink, Link2, Pencil, Trash2, X as XIcon } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiDiscord,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiTelegram,
  SiTradingview,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import {
  extractSocialUsername,
  isValidSocialUrl,
  useSettings,
  type SocialPlatform,
} from "@/components/settings/SettingsContext";

export const Route = createFileRoute("/settings/social-links")({
  component: Page,
});

type PlatformMeta = {
  key: SocialPlatform;
  label: string;
  icon: IconType;
  color: string;
  placeholder: string;
  hint: string;
  format: (username: string) => string;
};

const PLATFORMS: PlatformMeta[] = [
  {
    key: "telegram",
    label: "Telegram",
    icon: SiTelegram,
    color: "#229ED9",
    placeholder: "https://t.me/username",
    hint: "t.me/username",
    format: (u) => `@${u}`,
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    icon: SiX,
    color: "#000000",
    placeholder: "https://x.com/username",
    hint: "x.com/username",
    format: (u) => `@${u}`,
  },
  {
    key: "discord",
    label: "Discord",
    icon: SiDiscord,
    color: "#5865F2",
    placeholder: "https://discord.com/users/id",
    hint: "discord.gg or discord.com/users",
    format: (u) => u,
  },
  {
    key: "tradingview",
    label: "TradingView",
    icon: SiTradingview,
    color: "#2962FF",
    placeholder: "https://tradingview.com/u/username",
    hint: "tradingview.com/u/username",
    format: (u) => `@${u}`,
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: SiYoutube,
    color: "#FF0000",
    placeholder: "https://youtube.com/@handle",
    hint: "youtube.com/@handle",
    format: (u) => `@${u}`,
  },
  {
    key: "github",
    label: "GitHub",
    icon: SiGithub,
    color: "#181717",
    placeholder: "https://github.com/username",
    hint: "github.com/username",
    format: (u) => `@${u}`,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
    color: "#0A66C2",
    placeholder: "https://linkedin.com/in/username",
    hint: "linkedin.com/in/username",
    format: (u) => u,
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: SiInstagram,
    color: "#E4405F",
    placeholder: "https://instagram.com/username",
    hint: "instagram.com/username",
    format: (u) => `@${u}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: SiFacebook,
    color: "#1877F2",
    placeholder: "https://facebook.com/username",
    hint: "facebook.com/username",
    format: (u) => u,
  },
  {
    key: "website",
    label: "Website",
    icon: TbWorld,
    color: "#64748b",
    placeholder: "https://your-site.com",
    hint: "your-site.com",
    format: (u) => u,
  },
];

function Page() {
  const { profile, updateSocial } = useSettings();
  const [editing, setEditing] = useState<SocialPlatform | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (p: SocialPlatform) => {
    setEditing(p);
    setDraft(profile.socials[p] ?? "");
  };
  const cancel = () => {
    setEditing(null);
    setDraft("");
  };
  const save = () => {
    if (!editing) return;
    const url = draft.trim();
    if (!url) {
      updateSocial(editing, null);
      toast.success("Link removed");
      cancel();
      return;
    }
    if (!isValidSocialUrl(editing, url)) {
      toast.error("That doesn't look like a valid URL for this platform.");
      return;
    }
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    updateSocial(editing, normalized);
    toast.success("Link saved");
    cancel();
  };
  const remove = (p: SocialPlatform) => {
    updateSocial(p, null);
    toast.success("Link removed");
  };

  const connected = useMemo(
    () => PLATFORMS.filter((p) => profile.socials[p.key]),
    [profile.socials],
  );

  return (
    <SettingsScreen title="Social Links">
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="mx-6 mb-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground"
      >
        <Link2 size={14} className="mt-0.5 shrink-0" />
        <span>
          Add profile URLs from other platforms. We validate each link and display the extracted
          username on your Cryptvora profile.
        </span>
      </motion.p>

      <SettingGroup label={`Connected · ${connected.length}/${PLATFORMS.length}`}>
        {PLATFORMS.map((p, i) => {
          const url = profile.socials[p.key];
          const username = url ? extractSocialUsername(p.key, url) : null;
          const isEditing = editing === p.key;
          const isLast = i === PLATFORMS.length - 1;

          return (
            <div key={p.key} className={!isLast ? "border-b border-border" : ""}>
              <div className="flex items-center gap-3.5 px-4 py-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: p.color }}
                >
                  <p.icon size={17} strokeWidth={2.1} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[14.5px] font-medium text-foreground">{p.label}</p>
                    {url && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider"
                        style={{
                          background: "color-mix(in oklab, var(--success) 16%, transparent)",
                          color: "var(--success)",
                        }}
                      >
                        Linked
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
                    {username ? p.format(username) : p.hint}
                  </p>
                </div>
                {!isEditing && (
                  <div className="flex shrink-0 items-center gap-1">
                    {url && (
                      <>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-foreground"
                          aria-label={`Open ${p.label}`}
                        >
                          <ExternalLink size={15} />
                        </a>
                        <button
                          onClick={() => remove(p.key)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] hover:text-destructive"
                          aria-label={`Remove ${p.label}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => startEdit(p.key)}
                      className="flex h-8 items-center gap-1 rounded-lg px-2.5 text-[12.5px] font-medium text-[var(--primary)] hover:bg-[var(--primary-soft)]"
                    >
                      {url ? (
                        <>
                          <Pencil size={13} /> Edit
                        </>
                      ) : (
                        <>
                          <AtSign size={13} /> Add
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence initial={false}>
                {isEditing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <input
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") save();
                          if (e.key === "Escape") cancel();
                        }}
                        placeholder={p.placeholder}
                        className={`w-full rounded-xl border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] px-3 py-2.5 text-[13.5px] text-foreground outline-none focus:border-[color-mix(in_oklab,var(--primary)_40%,transparent)] ${
                          draft && !isValidSocialUrl(p.key, draft.trim())
                            ? "border-destructive/60"
                            : "border-border"
                        }`}
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-[11.5px] text-muted-foreground">
                          {draft && !isValidSocialUrl(p.key, draft.trim())
                            ? `Expected format: ${p.hint}`
                            : `Format: ${p.hint}`}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={cancel}
                            className="rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={save}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold text-white"
                            style={{ background: "var(--gradient-brand)" }}
                          >
                            <Check size={13} /> Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </SettingGroup>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-6 mt-2 flex items-center justify-center gap-1.5 text-[11.5px] text-muted-foreground"
      >
        <XIcon size={11} /> URLs are validated locally — nothing is shared until you save.
      </motion.div>
    </SettingsScreen>
  );
}
