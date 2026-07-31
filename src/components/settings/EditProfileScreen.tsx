import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Camera, Check, Globe, Loader2, MapPin, Pencil, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { BADGES, useSettings, type Profile } from "./SettingsContext";

export function EditProfileScreen({ onDone }: { onDone: () => void }) {
  const { profile, setProfile } = useSettings();
  const [draft, setDraft] = useState<Profile>(profile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const errors: Partial<Record<keyof Profile, string>> = {};
  if (draft.displayName.trim().length < 2)
    errors.displayName = "Name must be at least 2 characters";
  if (draft.username && !/^[a-z0-9._]{3,20}$/i.test(draft.username))
    errors.username = "3-20 chars · letters, numbers, . or _";
  if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email))
    errors.email = "Enter a valid email";
  if (draft.bio.length > 160) errors.bio = `${draft.bio.length}/160`;

  const invalid = Object.keys(errors).length > 0;

  const submit = async () => {
    if (invalid) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 650));
    setProfile(draft);
    setSaving(false);
    setSaved(true);
    setTimeout(onDone, 800);
  };

  const initials = draft.displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="pb-28">
      {/* ============ Minimal identity header (no cover) ============ */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease }} className="relative"
      >
        {/* Avatar + identity */}
        <div className="px-5 pt-4">
          <div className="flex items-end gap-4">
            <button className="relative shrink-0 press"
              aria-label="Change photo"
            >
              <div
                aria-hidden className="absolute -inset-2 rounded-full opacity-60 blur-xl"
                style={{
                  background: `radial-gradient(circle, ${draft.avatarColor}, transparent 65%)`,
                }}
              />
              <div className="relative flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-full text-[28px] font-semibold text-white"
                style={{
                  background: draft.avatarColor,
                  boxShadow:
                    "0 0 0 4px var(--background), 0 0 0 5px color-mix(in oklab, var(--primary) 32%, transparent), 0 16px 32px -12px color-mix(in oklab, var(--primary) 40%, transparent)",
                }}
              >
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{
                  background: "var(--primary)",
                  boxShadow:
                    "0 0 0 3px var(--background), 0 6px 14px -4px color-mix(in oklab, var(--primary) 60%, transparent)",
                }}
              >
                <Camera size={14} strokeWidth={2.3} />
              </span>
            </button>
          </div>

          {/* Editable name + username */}
          <div className="mt-4">
            <InlineEdit
              value={draft.displayName}
              onChange={(v) => update("displayName", v)}
              placeholder="Your name"
              size="xl"
              trailing={
                draft.verified ? (
                  <BadgeCheck size={20} className="text-[var(--primary)]" strokeWidth={2.5} />
                ) : null
              }
              error={errors.displayName}
              maxLength={40}
            />
            <div className="mt-1 flex items-center gap-1.5 text-[14px] text-muted-foreground">
              <span>@</span>
              <InlineEdit
                value={draft.username}
                onChange={(v) => update("username", v.replace(/\s/g, ""))}
                placeholder="username"
                size="sm"
                error={errors.username}
                maxLength={20}
              />
              {(() => {
                const b = BADGES.find((x) => x.id === draft.badge);
                if (!b || b.id === "none") return null;
                return (
                  <>
                    <span className="opacity-60">·</span>
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${b.from}, ${b.to})`,
                        boxShadow: `0 4px 12px -6px ${b.from}`,
                      }}
                    >
                      <BadgeCheck size={10} strokeWidth={2.8} /> {b.label}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Save / Cancel — the "Follow / Message" row from public profile */}
          <div className="mt-5 flex gap-2.5">
            <button disabled={invalid || saving}
              onClick={submit} className="relative flex h-11 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full text-[14px] font-semibold text-white disabled:opacity-50 press"
              style={{
                background: "var(--gradient-brand, var(--primary))",
                boxShadow: "0 10px 24px -10px color-mix(in oklab, var(--primary) 55%, transparent)",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {saved ? (
                  <motion.span
                    key="d"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }} className="flex items-center gap-1.5"
                  >
                    <Check size={16} strokeWidth={2.5} /> Saved
                  </motion.span>
                ) : saving ? (
                  <motion.span
                    key="s"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} className="flex items-center gap-1.5"
                  >
                    <Loader2 size={15} className="animate-spin" /> Saving
                  </motion.span>
                ) : (
                  <motion.span
                    key="i"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} className="flex items-center gap-1.5"
                  >
                    <Check size={15} strokeWidth={2.5} /> Save profile
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button onClick={onDone} className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-border bg-surface/70 px-5 text-[14px] font-medium text-foreground press"
            >
              <X size={15} strokeWidth={2.2} /> Cancel
            </button>
          </div>
        </div>
      </motion.section>

      {/* ============ BIO ============ */}
      <SectionCard delay={0.05}>
        <EditableTextarea
          value={draft.bio}
          onChange={(v) => update("bio", v)}
          placeholder="Write a short bio about yourself…"
          maxLength={160}
          error={errors.bio}
        />
      </SectionCard>

      {/* ============ META ROW: location + website ============ */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.08, ease }} className="mx-5 mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]"
      >
        <MetaEdit
          icon={<MapPin size={14} className="text-muted-foreground" strokeWidth={2.2} />}
          value={draft.location}
          onChange={(v) => update("location", v)}
          placeholder="Add location"
        />
        <MetaEdit
          icon={<Globe size={14} className="text-[var(--primary)]" strokeWidth={2.2} />}
          value={draft.website}
          onChange={(v) => update("website", v)}
          placeholder="your.site"
          accent
        />
      </motion.div>

      {/* Stats (Followers / Following / Signals) live only on the public profile. */}

      {/* ============ VERIFICATION BADGE SELECTOR ============ */}
      <SectionLabel delay={0.12}>Verification badge</SectionLabel>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.14, ease }} className="mx-5 mt-2 flex flex-wrap gap-2 rounded-2xl border border-border bg-surface/60 p-3"
      >
        {BADGES.map((b) => {
          const allowed = draft.availableBadges.includes(b.id);
          const selected = draft.badge === b.id;
          const isNone = b.id === "none";
          return (
            <button
              key={b.id}
              type="button"
              
              onClick={() => allowed && update("badge", b.id)}
              disabled={!allowed}
              title={allowed ? b.description : "Not available for your account"} className="relative inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: isNone ? "transparent" : `linear-gradient(135deg, ${b.from}, ${b.to})`,
                color: isNone ? "var(--foreground)" : "#fff",
                border: isNone ? "1px dashed var(--border)" : "1px solid transparent",
                boxShadow:
                  selected && !isNone
                    ? `0 0 0 2px var(--background), 0 0 0 4px ${b.from}, 0 8px 18px -8px ${b.from}`
                    : selected && isNone
                      ? "0 0 0 2px var(--background), 0 0 0 3px var(--primary)"
                      : !isNone
                        ? `0 4px 12px -8px ${b.from}`
                        : "none",
                opacity: allowed ? (selected ? 1 : 0.85) : undefined,
              }}
            >
              {!isNone && <BadgeCheck size={11} strokeWidth={2.6} />}
              {b.label}
              {selected && <Check size={11} strokeWidth={3} className="ml-0.5" />}
            </button>
          );
        })}
        <p className="mt-1 w-full text-[11.5px] text-muted-foreground">
          Choose the badge shown next to your name. Locked badges become available as you unlock
          them.
        </p>
      </motion.div>

      {/* Connected accounts moved to /settings/social-links */}

      {/* ============ CRYPTO IDENTITY ============ */}
      <SectionLabel delay={0.2}>Crypto identity</SectionLabel>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.22, ease }} className="mx-5 mt-2 space-y-2.5"
      >
        <SocialCard
          label="Cryptvora ID"
          value={draft.cryptoId}
          onChange={(v) => update("cryptoId", v)}
          full
        />
        <SocialCard
          label="Wallet address"
          value={draft.walletAddress}
          onChange={(v) => update("walletAddress", v)}
          placeholder="0x…"
          full
          mono
        />
        <SocialCard
          label="Chain"
          value={draft.walletChain}
          onChange={(v) => update("walletChain", v)}
          placeholder="Ethereum, Solana, …"
          full
        />
      </motion.div>

      {/* ============ CONTACT (private) ============ */}
      <SectionLabel delay={0.24}>Contact · Private</SectionLabel>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.26, ease }} className="mx-5 mt-2 space-y-2.5"
      >
        <SocialCard
          label="Email"
          value={draft.email}
          onChange={(v) => update("email", v)}
          error={errors.email}
          full
        />
        <SocialCard label="Phone" value={draft.phone} onChange={(v) => update("phone", v)} full />
      </motion.div>
    </div>
  );
}

/* ============================================================
 * Sub-components
 * ============================================================ */

function SectionLabel({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.h3
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }} className="mx-5 mt-6 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80"
    >
      {children}
    </motion.h3>
  );
}

function SectionCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay, ease: [0.16, 1, 0.3, 1] }} className="mx-5 mt-5"
    >
      {children}
    </motion.div>
  );
}

function InlineEdit({
  value,
  onChange,
  placeholder,
  size = "md",
  trailing,
  error,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "xl";
  trailing?: ReactNode;
  error?: string;
  maxLength?: number;
}) {
  const [focus, setFocus] = useState(false);
  const sizes = {
    sm: "text-[14px]",
    md: "text-[15px]",
    xl: "text-[24px] font-semibold tracking-[-0.02em] leading-tight",
  } as const;

  return (
    <div className="min-w-0 flex-1">
      <div className="group relative inline-flex max-w-full items-center gap-1.5"
        style={{
          borderBottom:
            size === "xl"
              ? focus
                ? "1px dashed color-mix(in oklab, var(--primary) 55%, transparent)"
                : "1px dashed transparent"
              : "none",
        }}
      >
        <input
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={`min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/70 ${sizes[size]}`}
          size={Math.max(placeholder?.length ?? 8, value.length || 8)}
          style={{
            width: `${Math.max((value.length || (placeholder?.length ?? 8)) + 1, 8)}ch`,
          }}
        />
        {trailing}
        {!focus && size === "xl" && (
          <Pencil
            size={13} className="ml-1 shrink-0 text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
      </div>
      {error && <p className="mt-1 text-[11.5px] text-[var(--destructive)]">{error}</p>}
    </div>
  );
}

function EditableTextarea({
  value,
  onChange,
  placeholder,
  maxLength,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div className="rounded-2xl border bg-surface/60 px-4 py-3 transition-colors"
      style={{
        borderColor: focus
          ? "color-mix(in oklab, var(--primary) 45%, var(--border))"
          : "var(--border)",
      }}
    >
      <textarea
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        rows={3} className="w-full resize-none bg-transparent text-[14.5px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
      />
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {focus ? "Editing bio" : "Tap to edit"}
        </span>
        {maxLength && (
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-[11.5px] text-[var(--destructive)]">{error}</p>}
    </div>
  );
}

function MetaEdit({
  icon,
  value,
  onChange,
  placeholder,
  accent,
}: {
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  accent?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors"
      style={{
        background: focus ? "color-mix(in oklab, var(--primary) 10%, transparent)" : "transparent",
      }}
    >
      {icon}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={`min-w-0 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/70 ${accent ? "text-[var(--primary)]" : "text-foreground"}`}
        style={{
          width: `${Math.max((value.length || (placeholder?.length ?? 10)) + 1, 10)}ch`,
        }}
      />
    </div>
  );
}

function SocialCard({
  label,
  value,
  onChange,
  prefix,
  placeholder,
  error,
  full,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  placeholder?: string;
  error?: string;
  full?: boolean;
  mono?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div
      className={`${full ? "" : ""} rounded-2xl border bg-surface/60 px-4 py-3 transition-colors`}
      style={{
        borderColor: focus
          ? "color-mix(in oklab, var(--primary) 45%, var(--border))"
          : "var(--border)",
      }}
    >
      <p className="text-[11.5px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-1">
        {prefix && <span className="text-[14.5px] text-muted-foreground">{prefix}</span>}
        <input
          value={value}
          placeholder={placeholder ?? "—"}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={`w-full bg-transparent text-[14.5px] text-foreground outline-none placeholder:text-muted-foreground/70 ${mono ? "font-mono text-[13px] tracking-tight" : ""}`}
        />
      </div>
      {error && <p className="mt-1 text-[11.5px] text-[var(--destructive)]">{error}</p>}
    </div>
  );
}

function SocialUrlCard({
  label,
  value,
  onChange,
  placeholder,
  hint,
  username,
  valid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hint: string;
  username: string | null;
  valid: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const hasValue = value.trim().length > 0;
  const showError = hasValue && !valid;
  return (
    <div className="rounded-2xl border bg-surface/60 px-4 py-3 transition-colors"
      style={{
        borderColor: showError
          ? "color-mix(in oklab, var(--destructive) 55%, var(--border))"
          : focus
            ? "color-mix(in oklab, var(--primary) 45%, var(--border))"
            : "var(--border)",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11.5px] font-medium text-muted-foreground">{label}</p>
        {username && !showError && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)]"
            style={{ background: "var(--primary-soft)" }}
          >
            <Check size={10} strokeWidth={3} /> @{username}
          </motion.span>
        )}
      </div>
      <input
        type="url"
        inputMode="url"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)} className="mt-1 w-full bg-transparent font-mono text-[13px] text-foreground outline-none placeholder:text-muted-foreground/60"
      />
      <p
        className={`mt-1 text-[11px] ${showError ? "text-[var(--destructive)]" : "text-muted-foreground/80"}`}
      >
        {showError ? `Invalid URL — expected ${hint}` : hint}
      </p>
    </div>
  );
}
