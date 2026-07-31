import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { RadioList } from "@/components/settings/rows";
import { useSettings } from "@/components/settings/SettingsContext";
import { vibrateDevice } from "@/lib/native-feedback";

export const Route = createFileRoute("/settings/security/recovery")({
  component: Page,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s().-]{6,}$/;

function Page() {
  const { prefs, setPref } = useSettings();
  const [email, setEmail] = useState(prefs.recoveryEmail);
  const [phone, setPhone] = useState(prefs.recoveryPhone);

  const saveEmail = () => {
    if (email && !EMAIL_RE.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    setPref("recoveryEmail", email);
    vibrateDevice(15);
    toast.success("Recovery email saved");
  };
  const savePhone = () => {
    if (phone && !PHONE_RE.test(phone)) {
      toast.error("Enter a valid phone number");
      return;
    }
    setPref("recoveryPhone", phone);
    vibrateDevice(15);
    toast.success("Recovery phone saved");
  };

  return (
    <SettingsScreen title="Recovery">
      <div className="mx-6 mb-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
        <ShieldCheck size={14} className="mt-0.5 shrink-0" />
        <span>
          Recovery methods help you regain access if you're locked out. Keep at least one method up
          to date.
        </span>
      </div>

      <SettingGroup label="Recovery email">
        <FieldRow
          icon={<Mail size={16} />}
          value={email}
          onChange={setEmail}
          onSave={saveEmail}
          placeholder="you@example.com"
          type="email"
        />
      </SettingGroup>

      <SettingGroup label="Recovery phone">
        <FieldRow
          icon={<Phone size={16} />}
          value={phone}
          onChange={setPhone}
          onSave={savePhone}
          placeholder="+1 555 000 0000"
          type="tel"
        />
      </SettingGroup>

      <SettingGroup label="Backup security method">
        <RadioList
          value={prefs.backupMethod}
          options={[
            { value: "none", label: "None" },
            {
              value: "email",
              label: "Recovery email",
              description: "Send code by email",
            },
            {
              value: "phone",
              label: "Recovery phone",
              description: "Send code by SMS",
            },
            {
              value: "google",
              label: "Google account",
              description: "Sign in with Google",
            },
          ]}
          onChange={(v) => {
            setPref("backupMethod", v as "none" | "email" | "phone" | "google");
            vibrateDevice(15);
            toast.success("Backup method updated");
          }}
        />
      </SettingGroup>
    </SettingsScreen>
  );
}

function FieldRow({
  icon,
  value,
  onChange,
  onSave,
  placeholder,
  type,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  placeholder: string;
  type: string;
}) {
  return (
    <div className="flex items-center gap-2 p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--primary)]"
        style={{
          background: "color-mix(in oklab, var(--primary) 14%, transparent)",
        }}
      >
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} className="flex-1 rounded-xl border border-border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] px-3 py-2 text-[14px] text-foreground outline-none focus:border-[color-mix(in_oklab,var(--primary)_40%,transparent)]"
      />
      <button onClick={onSave} className="rounded-xl px-3 py-2 text-[13px] font-semibold text-white press"
        style={{ background: "var(--gradient-brand)" }}
      >
        Save
      </button>
    </div>
  );
}
