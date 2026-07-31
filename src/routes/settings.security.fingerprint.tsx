import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Fingerprint, ShieldCheck, Sparkles } from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { RowToggle } from "@/components/settings/rows";
import { useSettings } from "@/components/settings/SettingsContext";
import { vibrateDevice } from "@/lib/native-feedback";

export const Route = createFileRoute("/settings/security/fingerprint")({
  component: Page,
});

async function nativeAuthenticate(): Promise<boolean> {
  try {
    if (typeof window !== "undefined" && "PublicKeyCredential" in window) {
      const available = await (
        window.PublicKeyCredential as unknown as {
          isUserVerifyingPlatformAuthenticatorAvailable?: () => Promise<boolean>;
        }
      ).isUserVerifyingPlatformAuthenticatorAvailable?.();
      if (available) {
        const cred = await navigator.credentials
          .get({
            publicKey: {
              challenge: crypto.getRandomValues(new Uint8Array(32)),
              timeout: 30000,
              userVerification: "required",
            },
          } as CredentialRequestOptions)
          .catch(() => null);
        if (cred) return true;
      }
    }
  } catch {
    /* noop */
  }
  return false;
}

function Page() {
  const { prefs, setPref } = useSettings();
  const [pulse, setPulse] = useState(false);
  const [testing, setTesting] = useState(false);

  const test = async () => {
    setTesting(true);
    setPulse(true);
    vibrateDevice([30, 40, 60]);
    const ok = await nativeAuthenticate();
    setPulse(false);
    setTesting(false);
    if (ok) {
      vibrateDevice([20, 20, 20]);
      toast.success("Authentication successful");
    } else {
      toast("Biometric authentication unavailable", {
        description: "Your device or browser did not confirm the request.",
      });
    }
  };

  return (
    <SettingsScreen title="Fingerprint / Face ID">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="mx-3 mb-5 overflow-hidden rounded-[26px] border border-border p-6 text-center"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, color-mix(in oklab, var(--primary) 22%, transparent), var(--surface) 70%)",
        }}
      >
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
          <motion.span
            animate={
              pulse ? { scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] } : { scale: 1, opacity: 0.35 }
            }
            transition={{ duration: 1.4, repeat: pulse ? Infinity : 0 }} className="absolute inset-0 rounded-full"
            style={{
              background: "color-mix(in oklab, var(--primary) 35%, transparent)",
            }}
          />
          <motion.span
            animate={
              pulse ? { scale: [1, 1.15, 1], opacity: [0.8, 0.3, 0.8] } : { scale: 1, opacity: 0.6 }
            }
            transition={{
              duration: 1.4,
              repeat: pulse ? Infinity : 0,
              delay: 0.2,
            }} className="absolute inset-4 rounded-full"
            style={{
              background: "color-mix(in oklab, var(--primary) 55%, transparent)",
            }}
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-2xl"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Fingerprint size={40} strokeWidth={1.6} />
          </div>
        </div>

        <h2 className="mt-5 text-[19px] font-semibold text-foreground">Biometric unlock</h2>
        <p className="mx-auto mt-1.5 max-w-[300px] text-[13px] leading-relaxed text-muted-foreground">
          Use your fingerprint or Face ID to unlock Cryptvora instantly. Your biometric data never
          leaves this device.
        </p>
      </motion.div>

      <SettingGroup>
        <RowToggle
          icon={Fingerprint}
          label="Enable biometric unlock"
          description="Face ID or fingerprint"
          checked={prefs.biometric}
          onChange={(v) => {
            setPref("biometric", v);
            vibrateDevice(15);
            toast(v ? "Biometric unlock enabled" : "Biometric unlock disabled");
          }}
        />
        <RowToggle
          icon={ShieldCheck}
          label="Require on app start"
          description="Authenticate every time you open the app"
          checked={prefs.biometric}
          onChange={(v) => setPref("biometric", v)}
          last
        />
      </SettingGroup>

      <div className="mx-3 mt-2">
        <button disabled={testing}
          onClick={test} className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14.5px] font-semibold text-white shadow-lg disabled:opacity-60 press"
          style={{
            background: "var(--gradient-brand)",
            boxShadow: "0 14px 30px -14px color-mix(in oklab, var(--primary) 60%, transparent)",
          }}
        >
          <Sparkles size={16} />
          {testing ? "Waiting for device…" : "Test Authentication"}
        </button>
        <p className="mx-2 mt-2 text-center text-[11.5px] text-muted-foreground">
          Uses your device's native authenticator (WebAuthn / platform biometric).
        </p>
      </div>
    </SettingsScreen>
  );
}
