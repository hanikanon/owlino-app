import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Delete, Hash, ShieldCheck, Trash2 } from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { useSettings } from "@/components/settings/SettingsContext";
import { vibrateDevice } from "@/lib/native-feedback";

export const Route = createFileRoute("/settings/security/pin")({
  component: Page,
});

type Mode = "create" | "confirm" | "verify" | "done";

function Keypad({
  value,
  onKey,
  onDelete,
  shake,
}: {
  value: string;
  length: 4 | 6;
  onKey: (d: string) => void;
  onDelete: () => void;
  shake: boolean;
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];
  return (
    <div className="mx-auto max-w-[300px]">
      <motion.div
        animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }} className="mb-8 flex items-center justify-center gap-3"
      >
        {Array.from({ length: value.length || 0 }).map((_, i) => (
          <span key={i} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => {
          const filled = i < value.length;
          return (
            <motion.span
              key={i}
              animate={{
                scale: filled ? 1 : 0.75,
                backgroundColor: filled
                  ? "var(--primary)"
                  : "color-mix(in oklab, var(--foreground) 14%, transparent)",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }} className="h-3.5 w-3.5 rounded-full"
            />
          );
        })}
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        {keys.map((k, i) => {
          if (k === "") return <span key={i} />;
          if (k === "del")
            return (
              <button
                key={i} onClick={onDelete} className="flex h-16 items-center justify-center rounded-2xl text-foreground/80 transition-colors hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] press"
              >
                <Delete size={22} />
              </button>
            );
          return (
            <button
              key={i} onClick={() => onKey(k)} className="h-16 rounded-2xl text-[22px] font-semibold text-foreground shadow-inner transition-colors"
              style={{
                background: "color-mix(in oklab, var(--foreground) 5%, var(--surface))",
                boxShadow: "inset 0 1px 0 color-mix(in oklab, white 6%, transparent)",
              }}
            >
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Page() {
  const { prefs, setPref } = useSettings();
  const navigate = useNavigate();
  const hasPin = !!prefs.pin;

  const [length] = useState<4 | 6>(6);
  const [mode, setMode] = useState<Mode>(hasPin ? "verify" : "create");
  const [value, setValue] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [shake, setShake] = useState(false);

  const title = useMemo(() => {
    if (mode === "verify") return "Enter your current PIN";
    if (mode === "confirm") return "Confirm your PIN";
    if (mode === "done") return "PIN protected";
    return "Create your secure PIN";
  }, [mode]);

  const subtitle = useMemo(() => {
    if (mode === "verify") return "Verify to change or remove your PIN.";
    if (mode === "confirm") return "Re-enter the same PIN to confirm.";
    if (mode === "done") return "Your PIN is active and ready.";
    return `Enter a ${length}-digit code you'll remember.`;
  }, [mode, length]);

  const wrong = () => {
    setShake(true);
    vibrateDevice([60, 40, 60]);
    setTimeout(() => setShake(false), 450);
    setTimeout(() => setValue(""), 250);
  };

  const success = () => {
    vibrateDevice([20, 20, 40]);
  };

  const onKey = (d: string) => {
    if (value.length >= length) return;
    vibrateDevice(10);
    const next = value + d;
    setValue(next);
    if (next.length === length) {
      setTimeout(() => handleComplete(next), 120);
    }
  };

  const handleComplete = (v: string) => {
    if (mode === "verify") {
      if (v === prefs.pin) {
        success();
        setValue("");
        setMode("create");
      } else {
        wrong();
        toast.error("Incorrect PIN");
      }
      return;
    }
    if (mode === "create") {
      success();
      setFirstPin(v);
      setValue("");
      setMode("confirm");
      return;
    }
    if (mode === "confirm") {
      if (v === firstPin) {
        success();
        setPref("pin", v);
        setValue("");
        setMode("done");
        toast.success("PIN saved");
      } else {
        wrong();
        toast.error("PINs don't match");
      }
    }
  };

  const removePin = () => {
    setPref("pin", null);
    vibrateDevice(40);
    toast.success("PIN removed");
    navigate({ to: "/settings/security" });
  };

  return (
    <SettingsScreen title="PIN Code">
      <div className="px-6 pt-2">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Hash size={24} />
        </div>
        <motion.h2
          key={title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }} className="text-center text-[20px] font-semibold text-foreground"
        >
          {title}
        </motion.h2>
        <p className="mx-auto mt-1 max-w-[280px] text-center text-[13px] leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 px-4">
        <AnimatePresence mode="wait">
          {mode === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} className="mx-auto flex max-w-[300px] flex-col items-center gap-4 rounded-3xl border border-border bg-[color-mix(in_oklab,var(--primary)_8%,var(--surface))] p-6 text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }} className="flex h-16 w-16 items-center justify-center rounded-full text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                <ShieldCheck size={30} />
              </motion.span>
              <p className="text-[15px] font-semibold text-foreground">PIN is now active</p>
              <div className="flex w-full flex-col gap-2">
                <button
                  onClick={() => {
                    setValue("");
                    setMode("verify");
                  }} className="w-full rounded-xl border border-border py-2.5 text-[13.5px] font-semibold text-foreground"
                >
                  Change PIN
                </button>
                <button
                  onClick={removePin} className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13.5px] font-semibold text-destructive"
                  style={{
                    background: "color-mix(in oklab, var(--destructive) 12%, transparent)",
                  }}
                >
                  <Trash2 size={14} /> Remove PIN
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="pad"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Keypad
                value={value}
                length={length}
                onKey={onKey}
                onDelete={() => {
                  vibrateDevice(10);
                  setValue((v) => v.slice(0, -1));
                }}
                shake={shake}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SettingsScreen>
  );
}
