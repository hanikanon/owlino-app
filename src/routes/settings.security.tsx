import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Bell,
  Fingerprint,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  ShieldOff,
  Timer,
  Hash,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { SettingItem } from "@/components/settings/SettingItem";
import { RowToggle } from "@/components/settings/rows";
import { useSettings, type AutoLockValue } from "@/components/settings/SettingsContext";
import { vibrateDevice } from "@/lib/native-feedback";

export const Route = createFileRoute("/settings/security")({
  component: Page,
});

const AUTO_LOCK_LABEL: Record<AutoLockValue, string> = {
  immediate: "Immediately",
  "30s": "30 seconds",
  "1m": "1 minute",
  "5m": "5 minutes",
  "10m": "10 minutes",
  "30m": "30 minutes",
  never: "Never",
};

type ScoreItem = { label: string; ok: boolean };

function useSecurityScore() {
  const { prefs, profile } = useSettings();
  const items: ScoreItem[] = [
    { label: "Fingerprint / Face ID", ok: prefs.biometric },
    { label: "PIN Code enabled", ok: !!prefs.pin },
    { label: "Password set", ok: !!prefs.password },
    { label: "Two-factor authentication", ok: prefs.twoFactor },
    { label: "Recovery email", ok: !!prefs.recoveryEmail || !!profile.email },
    { label: "Login alerts", ok: prefs.loginAlerts },
  ];
  const done = items.filter((i) => i.ok).length;
  const score = Math.round((done / items.length) * 100);
  return { items, score };
}

function ScoreRing({ value }: { value: number }) {
  const size = 92;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const tone = value >= 80 ? "var(--primary)" : value >= 50 ? "#f59e0b" : "var(--destructive)";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="color-mix(in oklab, var(--foreground) 10%, transparent)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ strokeDasharray: c, filter: `drop-shadow(0 0 8px ${tone})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold leading-none text-foreground tabular-nums">
          {value}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function Page() {
  const { prefs, setPref, blockedDevices } = useSettings();
  const navigate = useNavigate();
  const { items, score } = useSecurityScore();

  const tone = score >= 80 ? "Excellent" : score >= 50 ? "Needs attention" : "At risk";
  const toneColor = score >= 80 ? "var(--primary)" : score >= 50 ? "#f59e0b" : "var(--destructive)";

  return (
    <SettingsScreen title="Security">
      {/* Security Status */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mx-3 mb-5 overflow-hidden rounded-[26px] border border-border"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 14%, var(--surface)) 0%, var(--surface) 60%)",
          boxShadow: "0 20px 40px -24px color-mix(in oklab, var(--primary) 55%, transparent)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-4 p-4">
          <ScoreRing value={score} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Security Score
            </p>
            <p
              className="mt-0.5 text-[18px] font-semibold leading-tight"
              style={{ color: toneColor }}
            >
              {tone}
            </p>
            <p className="mt-1 text-[12.5px] leading-snug text-muted-foreground">
              {score >= 80
                ? "Your account is well protected."
                : "Complete the steps below to strengthen your account."}
            </p>
          </div>
        </div>
        <div className="border-t border-border/60 bg-[color-mix(in_oklab,var(--foreground)_2%,transparent)] px-4 py-3">
          <ul className="space-y-1.5">
            {items.map((it) => (
              <li key={it.label} className="flex items-center gap-2 text-[13px] text-foreground/90">
                {it.ok ? (
                  <CheckCircle2 size={14} style={{ color: "var(--primary)" }} />
                ) : (
                  <AlertTriangle size={14} style={{ color: "#f59e0b" }} />
                )}
                <span className={it.ok ? "" : "text-muted-foreground"}>{it.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Screen Lock */}
      <SettingGroup label="Screen Lock">
        <SettingItem
          icon={Fingerprint}
          label="Fingerprint / Face ID"
          description="Unlock with biometrics"
          trailing={prefs.biometric ? "On" : "Off"}
          onClick={() => navigate({ to: "/settings/security/fingerprint" })}
        />
        <SettingItem
          icon={Hash}
          label="PIN Code"
          description={prefs.pin ? "PIN is set" : "Not configured"}
          trailing={prefs.pin ? `${prefs.pin.length} digits` : "Set up"}
          onClick={() => navigate({ to: "/settings/security/pin" })}
        />
        <SettingItem
          icon={KeyRound}
          label="Password"
          description={prefs.password ? "Password is set" : "Not configured"}
          trailing={prefs.password ? "Change" : "Set up"}
          onClick={() => navigate({ to: "/settings/security/password" })}
        />
        <SettingItem
          icon={Timer}
          label="Auto Lock"
          trailing={AUTO_LOCK_LABEL[prefs.autoLock]}
          onClick={() => navigate({ to: "/settings/security/auto-lock" })}
          last
        />
      </SettingGroup>

      {/* Recovery */}
      <SettingGroup label="Recovery">
        <SettingItem
          icon={Mail}
          label="Recovery email"
          trailing={prefs.recoveryEmail ? "Set" : "Add"}
          onClick={() => navigate({ to: "/settings/security/recovery" })}
        />
        <SettingItem
          icon={Phone}
          label="Recovery phone"
          trailing={prefs.recoveryPhone ? "Set" : "Add"}
          onClick={() => navigate({ to: "/settings/security/recovery" })}
        />
        <SettingItem
          icon={ShieldCheck}
          label="Backup security method"
          trailing={
            prefs.backupMethod === "none"
              ? "None"
              : prefs.backupMethod === "email"
                ? "Email"
                : prefs.backupMethod === "phone"
                  ? "Phone"
                  : "Google"
          }
          onClick={() => navigate({ to: "/settings/security/recovery" })}
          last
        />
      </SettingGroup>

      {/* Advanced */}
      <SettingGroup label="Advanced">
        <RowToggle
          icon={Bell}
          label="Login alerts"
          description="Notify me on new sign-ins"
          checked={prefs.loginAlerts}
          onChange={(v) => {
            setPref("loginAlerts", v);
            vibrateDevice(15);
          }}
        />
        <RowToggle
          icon={Lock}
          label="Two-factor authentication"
          description="Require a code on new devices"
          checked={prefs.twoFactor}
          onChange={(v) => {
            setPref("twoFactor", v);
            vibrateDevice(15);
            toast(v ? "2FA enabled" : "2FA disabled");
          }}
          last
        />
      </SettingGroup>

      <SettingGroup label="Sessions">
        <SettingItem
          icon={ShieldOff}
          label="Blocked devices"
          trailing={blockedDevices.length > 0 ? `${blockedDevices.length}` : "None"}
          onClick={() => navigate({ to: "/settings/blocked-devices" })}
        />
        <SettingItem
          icon={LogOut}
          label="Sign out of all other devices"
          danger
          showArrow={false}
          last
          onClick={() => toast.success("Signed out of 2 other devices")}
        />
      </SettingGroup>

      <div className="mx-6 mt-4 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
        <ShieldCheck size={12} /> End-to-end encrypted · Zero-knowledge storage
        <ChevronRight size={12} className="opacity-0" />
      </div>
    </SettingsScreen>
  );
}
