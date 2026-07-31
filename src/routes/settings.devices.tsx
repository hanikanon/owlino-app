import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Clock,
  Eye,
  Info,
  LogOut,
  MapPin,
  MoreVertical,
  Pencil,
  ShieldCheck,
  ShieldOff,
  X,
} from "lucide-react";
import {
  FaApple,
  FaWindows,
  FaLinux,
  FaAndroid,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
} from "react-icons/fa6";
import { SiIos } from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { useSettings } from "@/components/settings/SettingsContext";

type Device = {
  id: string;
  name: string;
  os: string;
  osIcon: IconType | ComponentType<{ size?: number; className?: string }>;
  app: string;
  appIcon: IconType | ComponentType<{ size?: number; className?: string }>;
  city: string;
  country: string;
  lastActive: string;
  current?: boolean;
  accent: string;
};

const INITIAL: Device[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    os: "iOS 18.2",
    osIcon: FaApple,
    app: "Cryptvora 1.0.0",
    appIcon: SiIos,
    city: "Lisbon",
    country: "Portugal",
    lastActive: "online",
    current: true,
    accent: "#34C759",
  },
  {
    id: "2",
    name: "MacBook Pro 14”",
    os: "macOS 15 Sequoia",
    osIcon: FaApple,
    app: "Chrome 131",
    appIcon: FaChrome,
    city: "Lisbon",
    country: "Portugal",
    lastActive: "2 hours ago",
    accent: "#0A84FF",
  },
  {
    id: "3",
    name: "iPad Air",
    os: "iPadOS 18.1",
    osIcon: FaApple,
    app: "Safari 18",
    appIcon: FaSafari,
    city: "Porto",
    country: "Portugal",
    lastActive: "Yesterday",
    accent: "#AF52DE",
  },
  {
    id: "4",
    name: "Windows Desktop",
    os: "Windows 11",
    osIcon: FaWindows,
    app: "Edge 130",
    appIcon: FaEdge,
    city: "Madrid",
    country: "Spain",
    lastActive: "3 days ago",
    accent: "#5E5CE6",
  },
  {
    id: "5",
    name: "Pixel 9 Pro",
    os: "Android 15",
    osIcon: FaAndroid,
    app: "Firefox 132",
    appIcon: FaFirefox,
    city: "Berlin",
    country: "Germany",
    lastActive: "1 week ago",
    accent: "#FF9500",
  },
];

export const Route = createFileRoute("/settings/devices")({
  component: Page,
});

function Page() {
  const { blockDevice } = useSettings();
  const [devices, setDevices] = useState(INITIAL);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [blockId, setBlockId] = useState<string | null>(null);

  const revoke = (id: string) => {
    setDevices((d) => d.filter((x) => x.id !== id));
    toast.success("Session ended");
  };
  const rename = (id: string, name: string) => {
    setDevices((d) => d.map((x) => (x.id === id ? { ...x, name } : x)));
    toast.success("Device renamed");
  };
  const confirmBlock = (id: string) => {
    const d = devices.find((x) => x.id === id);
    if (!d) return;
    blockDevice({
      id: d.id,
      name: d.name,
      os: d.os,
      app: d.app,
      city: d.city,
      country: d.country,
      blockedAt: new Date().toISOString(),
      accent: d.accent,
    });
    setDevices((prev) => prev.filter((x) => x.id !== id));
    setBlockId(null);
    toast.success(`${d.name} blocked`, {
      description: "This device can no longer sign in.",
    });
  };

  const activeSessions = devices.length;
  const detailsDevice = devices.find((d) => d.id === detailsId) ?? null;
  const renameDevice = devices.find((d) => d.id === renameId) ?? null;
  const blockDeviceObj = devices.find((d) => d.id === blockId) ?? null;

  return (
    <SettingsScreen title="Devices">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }} className="mx-6 mb-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground"
      >
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[var(--primary)]" />
        <span>
          These are the devices and browsers currently signed into your Cryptvora account. End any
          session you don't recognize.
        </span>
      </motion.div>

      <SettingGroup label={`Active sessions · ${activeSessions}`}>
        {devices.map((d, i) => (
          <DeviceRow
            key={d.id}
            device={d}
            last={i === devices.length - 1}
            menuOpen={openId === d.id}
            onOpenMenu={() => setOpenId(openId === d.id ? null : d.id)}
            onCloseMenu={() => setOpenId(null)}
            onDetails={() => setDetailsId(d.id)}
            onRename={() => setRenameId(d.id)}
            onBlock={() => setBlockId(d.id)}
            onSignOut={() => revoke(d.id)}
          />
        ))}
      </SettingGroup>

      <SettingGroup>
        <button onClick={() => {
            setDevices(INITIAL.filter((d) => d.current));
            toast.success("Signed out of all other sessions");
          }} className="flex w-full items-center justify-center gap-2 px-4 py-3.5 text-center text-[14px] font-medium text-destructive transition-colors hover:bg-[color-mix(in_oklab,var(--destructive)_7%,transparent)]"
        >
          <LogOut size={15} strokeWidth={2.2} />
          Sign out of all other sessions
        </button>
      </SettingGroup>

      <p className="mx-6 mt-3 text-center text-[11.5px] text-muted-foreground/80">
        Sessions automatically end after 30 days of inactivity.
      </p>

      {/* Details sheet */}
      <BottomSheet
        open={!!detailsDevice}
        onClose={() => setDetailsId(null)}
        title="Session details"
      >
        {detailsDevice && <DeviceDetails device={detailsDevice} />}
      </BottomSheet>

      {/* Rename sheet */}
      <BottomSheet open={!!renameDevice} onClose={() => setRenameId(null)} title="Rename device">
        {renameDevice && (
          <RenameForm
            initial={renameDevice.name}
            onCancel={() => setRenameId(null)}
            onSave={(name) => {
              rename(renameDevice.id, name);
              setRenameId(null);
            }}
          />
        )}
      </BottomSheet>

      {/* Block confirm dialog */}
      <ConfirmDialog
        open={!!blockDeviceObj}
        onClose={() => setBlockId(null)}
        title="Block this device?"
        description={
          blockDeviceObj
            ? `${blockDeviceObj.name} will be signed out immediately and blocked from signing in again until you unblock it from Security settings.`
            : ""
        }
        confirmLabel="Block device"
        onConfirm={() => blockDeviceObj && confirmBlock(blockDeviceObj.id)}
      />
    </SettingsScreen>
  );
}

/* -------------------- Row -------------------- */

function DeviceRow({
  device,
  last,
  menuOpen,
  onOpenMenu,
  onCloseMenu,
  onDetails,
  onRename,
  onBlock,
  onSignOut,
}: {
  device: Device;
  last: boolean;
  menuOpen: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onDetails: () => void;
  onRename: () => void;
  onBlock: () => void;
  onSignOut: () => void;
}) {
  const OsIcon = device.osIcon;
  const AppIcon = device.appIcon;

  return (
    <div
      className={`relative flex items-center gap-3.5 px-4 py-3 ${!last ? "border-b border-border" : ""}`}
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
        style={{
          background: `color-mix(in oklab, ${device.accent} 16%, transparent)`,
          color: device.accent,
        }}
      >
        <OsIcon size={22} />
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2"
          style={{
            background: "var(--background)",
            borderColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <span className="flex h-full w-full items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--foreground)_8%,transparent)]">
            <AppIcon size={10} />
          </span>
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[15px] font-semibold leading-tight text-foreground">
            {device.name}
          </p>
          {device.current && (
            <span className="rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider"
              style={{
                background: "color-mix(in oklab, var(--success, #34C759) 18%, transparent)",
                color: "var(--success, #34C759)",
              }}
            >
              This device
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
          {device.os} · {device.app}
        </p>
        <div className="mt-1 flex items-center gap-3 text-[11.5px] text-muted-foreground/80">
          <span className="inline-flex items-center gap-1">
            <MapPin size={11} /> {device.city}, {device.country}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {device.lastActive === "online" ? (
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--success,#34C759)]" />
                online
              </span>
            ) : (
              device.lastActive
            )}
          </span>
        </div>
      </div>

      <button onClick={onOpenMenu}
        aria-label="Session actions"
        aria-expanded={menuOpen} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--foreground)_8%,transparent)] hover:text-foreground press"
      >
        <MoreVertical size={17} />
      </button>

      <ContextMenu open={menuOpen} onClose={onCloseMenu}>
        <MenuItem icon={Eye} label="View Details" onClick={onDetails} />
        <MenuItem icon={Pencil} label="Rename Device" onClick={onRename} />
        {!device.current && (
          <>
            <MenuDivider />
            <MenuItem icon={ShieldOff} label="Block Device" onClick={onBlock} danger />
            <MenuItem icon={LogOut} label="Sign Out" onClick={onSignOut} danger />
          </>
        )}
      </ContextMenu>
    </div>
  );
}

/* -------------------- Context menu -------------------- */

function ContextMenu({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.94, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -2 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          role="menu" className="absolute right-3 top-12 z-40 w-60 origin-top-right overflow-hidden rounded-2xl border border-border p-1.5"
          style={{
            background: "color-mix(in oklab, var(--background) 92%, var(--foreground) 4%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 20px 40px -12px rgba(0,0,0,0.35), 0 0 0 1px color-mix(in oklab, var(--foreground) 6%, transparent)",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      role="menuitem"
      className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13.5px] font-medium transition-colors ${
        danger
          ? "text-destructive hover:bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)]"
          : "text-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_7%,transparent)]"
      }`}
    >
      <Icon size={15} strokeWidth={2.1} />
      <span className="flex-1 truncate">{label}</span>
    </button>
  );
}

function MenuDivider() {
  return <div className="my-1 h-px bg-border" />;
}

/* -------------------- Bottom sheet -------------------- */

function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }} className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-border"
            style={{
              background: "color-mix(in oklab, var(--background) 96%, var(--foreground) 3%)",
              boxShadow: "0 -20px 60px -10px rgba(0,0,0,0.4)",
              paddingBottom: "env(safe-area-inset-bottom, 12px)",
            }}
          >
            <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-[color-mix(in_oklab,var(--foreground)_15%,transparent)]" />
            <div className="flex items-center justify-between px-5 py-3">
              <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
              <button
                onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-5 pb-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* -------------------- Details + Rename -------------------- */

function DeviceDetails({ device }: { device: Device }) {
  const OsIcon = device.osIcon;
  const rows = [
    { label: "Device", value: device.name },
    { label: "Operating system", value: device.os },
    { label: "Application", value: device.app },
    { label: "Location", value: `${device.city}, ${device.country}` },
    {
      label: "Last active",
      value: device.lastActive === "online" ? "Online now" : device.lastActive,
    },
    { label: "IP address", value: "84.12.•••.•••" },
    { label: "Device ID", value: device.id, mono: true },
  ];
  return (
    <div>
      <div className="flex items-center gap-3 rounded-2xl border border-border p-3.5"
        style={{
          background: "color-mix(in oklab, var(--foreground) 3%, transparent)",
        }}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            background: `color-mix(in oklab, ${device.accent} 18%, transparent)`,
            color: device.accent,
          }}
        >
          <OsIcon size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-foreground">{device.name}</p>
          <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
            {device.city}, {device.country}
          </p>
        </div>
        {device.current && (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              background: "color-mix(in oklab, var(--success,#34C759) 18%, transparent)",
              color: "var(--success,#34C759)",
            }}
          >
            Current
          </span>
        )}
      </div>

      <div className="mt-4 divide-y divide-border rounded-2xl border border-border">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
            <span className="text-[12.5px] text-muted-foreground">{r.label}</span>
            <span
              className={`truncate text-[13.5px] font-medium text-foreground ${r.mono ? "font-mono text-[12.5px]" : ""}`}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl p-3 text-[12px] leading-relaxed text-muted-foreground"
        style={{
          background: "color-mix(in oklab, var(--primary) 8%, transparent)",
        }}
      >
        <Info size={14} className="mt-0.5 shrink-0 text-[var(--primary)]" />
        <span>If you don't recognize this session, sign it out and change your password.</span>
      </div>
    </div>
  );
}

function RenameForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: string;
  onCancel: () => void;
  onSave: (v: string) => void;
}) {
  const [v, setV] = useState(initial);
  return (
    <div>
      <label className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
        Device name
      </label>
      <input
        autoFocus
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && v.trim() && onSave(v.trim())} className="mt-2 w-full rounded-xl border border-border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] px-3.5 py-3 text-[15px] text-foreground outline-none focus:border-[color-mix(in_oklab,var(--primary)_45%,transparent)]"
      />
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={onCancel} className="flex h-11 flex-1 items-center justify-center rounded-full border border-border text-[14px] font-medium text-foreground"
        >
          Cancel
        </button>
        <button disabled={!v.trim() || v.trim() === initial}
          onClick={() => onSave(v.trim())} className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full text-[14px] font-semibold text-white disabled:opacity-50"
          style={{ background: "var(--gradient-brand, var(--primary))" }}
        >
          <Check size={15} strokeWidth={2.4} /> Save
        </button>
      </div>
    </div>
  );
}

/* -------------------- Confirm dialog -------------------- */

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose} className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            role="alertdialog"
            aria-modal="true" className="fixed inset-0 z-[61] flex items-center justify-center p-6"
          >
            <div className="w-full max-w-[360px] overflow-hidden rounded-3xl border border-border"
              style={{
                background: "color-mix(in oklab, var(--background) 96%, var(--foreground) 3%)",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.55)",
              }}
            >
              <div className="flex flex-col items-center px-6 pb-2 pt-6 text-center">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    background: "color-mix(in oklab, var(--destructive) 14%, transparent)",
                    color: "var(--destructive)",
                  }}
                >
                  <AlertTriangle size={22} strokeWidth={2.2} />
                </span>
                <h3 className="text-[16px] font-semibold text-foreground">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-px bg-border">
                <button
                  onClick={onClose} className="bg-[color-mix(in_oklab,var(--background)_96%,var(--foreground)_3%)] px-4 py-3.5 text-[14px] font-medium text-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--foreground)_5%,transparent)]"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm} className="bg-[color-mix(in_oklab,var(--background)_96%,var(--foreground)_3%)] px-4 py-3.5 text-[14px] font-semibold text-destructive transition-colors hover:bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)]"
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Silence unused import warnings for icons kept for future rows
void FaLinux;
void ChevronRight;
