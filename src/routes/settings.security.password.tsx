import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { useSettings } from "@/components/settings/SettingsContext";
import { vibrateDevice } from "@/lib/native-feedback";

export const Route = createFileRoute("/settings/security/password")({
  component: Page,
});

type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string; color: string };

function scorePassword(p: string): Strength {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p) && /[^\w]/.test(p)) s++;
  const label = ["Too short", "Weak", "Medium", "Strong", "Very Strong"][s];
  const color = ["#64748b", "#ef4444", "#f59e0b", "#22c55e", "#10b981"][s];
  return { score: s as 0 | 1 | 2 | 3 | 4, label, color };
}

function Page() {
  const { prefs, setPref } = useSettings();
  const navigate = useNavigate();
  const has = !!prefs.password;

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const strength = useMemo(() => scorePassword(next), [next]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (has && current !== prefs.password) {
      vibrateDevice([60, 40, 60]);
      toast.error("Current password is incorrect");
      return;
    }
    if (strength.score < 2) {
      toast.error("Choose a stronger password");
      return;
    }
    if (next !== confirm) {
      vibrateDevice([60, 40, 60]);
      toast.error("Passwords don't match");
      return;
    }
    setPref("password", next);
    vibrateDevice([20, 20, 40]);
    toast.success(has ? "Password updated" : "Password created");
    navigate({ to: "/settings/security" });
  };

  const remove = () => {
    setPref("password", null);
    vibrateDevice(40);
    toast.success("Password removed");
    navigate({ to: "/settings/security" });
  };

  return (
    <SettingsScreen title="Password">
      <div className="px-6 pt-2">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ background: "var(--gradient-brand)" }}
        >
          <KeyRound size={24} />
        </div>
        <h2 className="text-center text-[20px] font-semibold text-foreground">
          {has ? "Change your password" : "Create a password"}
        </h2>
        <p className="mx-auto mt-1 max-w-[300px] text-center text-[13px] leading-relaxed text-muted-foreground">
          Use at least 8 characters with a mix of letters, numbers and symbols.
        </p>
      </div>

      <form
        onSubmit={submit} className="mx-3 mt-6 space-y-3 rounded-3xl border border-border bg-surface/80 p-4"
      >
        {has && (
          <Field label="Current password" value={current} onChange={setCurrent} show={show} />
        )}
        <Field
          label={has ? "New password" : "Password"}
          value={next}
          onChange={setNext}
          show={show}
          right={
            <button
              type="button"
              onClick={() => setShow((v) => !v)} className="text-muted-foreground hover:text-foreground"
              aria-label={show ? "Hide" : "Show"}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {next.length > 0 && (
          <div>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }} className="h-1.5 flex-1 origin-left rounded-full"
                  style={{
                    background:
                      i < strength.score
                        ? strength.color
                        : "color-mix(in oklab, var(--foreground) 10%, transparent)",
                  }}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[12px] font-medium" style={{ color: strength.color }}>
              {strength.label}
            </p>
          </div>
        )}

        <Field label="Confirm password" value={confirm} onChange={setConfirm} show={show} />

        <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14.5px] font-semibold text-white press"
          style={{
            background: "var(--gradient-brand)",
            boxShadow: "0 14px 30px -14px color-mix(in oklab, var(--primary) 60%, transparent)",
          }}
        >
          <ShieldCheck size={16} />
          {has ? "Update password" : "Create password"}
        </button>
      </form>

      {has && (
        <button
          onClick={remove} className="mx-3 mt-3 flex w-[calc(100%-1.5rem)] items-center justify-center gap-1.5 rounded-2xl py-3 text-[13.5px] font-semibold text-destructive"
          style={{
            background: "color-mix(in oklab, var(--destructive) 12%, transparent)",
          }}
        >
          <Trash2 size={14} /> Remove password
        </button>
      )}
    </SettingsScreen>
  );
}

function Field({
  label,
  value,
  onChange,
  show,
  right,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  right?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] px-3">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password" className="flex-1 bg-transparent py-2.5 text-[14px] text-foreground outline-none"
          placeholder="••••••••"
        />
        {right}
      </div>
    </label>
  );
}
