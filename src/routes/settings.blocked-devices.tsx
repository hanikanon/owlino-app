import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Clock, MapPin, ShieldOff, Undo2 } from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { useSettings } from "@/components/settings/SettingsContext";

export const Route = createFileRoute("/settings/blocked-devices")({
  component: Page,
});

function formatBlockedAt(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = Math.max(0, now - d.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

function Page() {
  const { blockedDevices, unblockDevice } = useSettings();

  return (
    <SettingsScreen title="Blocked Devices">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26 }} className="mx-6 mb-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground"
      >
        <ShieldOff size={14} className="mt-0.5 shrink-0 text-destructive" />
        <span>
          Blocked devices cannot sign in to your account. Unblock a device to allow it to sign in
          again.
        </span>
      </motion.div>

      {blockedDevices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }} className="mx-5 mt-6 flex flex-col items-center rounded-3xl border border-border bg-[color-mix(in_oklab,var(--foreground)_3%,transparent)] px-6 py-10 text-center"
        >
          <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "color-mix(in oklab, var(--foreground) 6%, transparent)",
              color: "var(--muted-foreground)",
            }}
          >
            <ShieldOff size={24} />
          </span>
          <p className="text-[15px] font-semibold text-foreground">No blocked devices</p>
          <p className="mt-1 max-w-[240px] text-[12.5px] leading-relaxed text-muted-foreground">
            When you block a device from your Devices list, it will appear here.
          </p>
        </motion.div>
      ) : (
        <SettingGroup label={`Blocked · ${blockedDevices.length}`}>
          {blockedDevices.map((d, i) => (
            <div
              key={d.id}
              className={`flex items-center gap-3.5 px-4 py-3 ${
                i < blockedDevices.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: `color-mix(in oklab, ${d.accent} 14%, transparent)`,
                  color: d.accent,
                }}
              >
                <ShieldOff size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold leading-tight text-foreground">
                  {d.name}
                </p>
                <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
                  {d.os} · {d.app}
                </p>
                <div className="mt-1 flex items-center gap-3 text-[11.5px] text-muted-foreground/80">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} /> {d.city}, {d.country}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} /> Blocked {formatBlockedAt(d.blockedAt)}
                  </span>
                </div>
              </div>
              <button onClick={() => {
                  unblockDevice(d.id);
                  toast.success(`${d.name} unblocked`);
                }} className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
              >
                <Undo2 size={13} strokeWidth={2.2} /> Unblock
              </button>
            </div>
          ))}
        </SettingGroup>
      )}
    </SettingsScreen>
  );
}
