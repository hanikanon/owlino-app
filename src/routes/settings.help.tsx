import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, HelpCircle, Info, LifeBuoy, Mail, MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { SettingItem } from "@/components/settings/SettingItem";

export const Route = createFileRoute("/settings/help")({
  component: Page,
});

const FAQ = [
  {
    q: "How do I enable two-factor authentication?",
    a: "Head to Security → Two-factor authentication and follow the setup. You'll need an authenticator app such as 1Password, Authy or Google Authenticator.",
  },
  {
    q: "How do I recover my account if I lose my device?",
    a: "Use one of your recovery codes generated in Security → Recovery codes, or contact support with your registered email.",
  },
  {
    q: "Where is my data stored?",
    a: "Messages are end-to-end encrypted and synced through our EU-based infrastructure. Backups can be disabled in Storage & Data.",
  },
  {
    q: "Can I export my chat history?",
    a: "Yes — open a chat, tap the header, then Export chat. You'll receive a downloadable .zip archive.",
  },
  {
    q: "How do I report a user?",
    a: "Long-press any message and choose Report. Our safety team reviews every report within 24 hours.",
  },
];

function Page() {
  const [open, setOpen] = useState<number | null>(0);
  const [form, setForm] = useState({ subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.subject.trim().length < 3 || form.message.trim().length < 10) {
      toast.error("Please give a subject and a message (10+ characters).");
      return;
    }
    setForm({ subject: "", message: "" });
    toast.success("Message sent", {
      description: "We'll reply within 24 hours.",
    });
  };

  return (
    <SettingsScreen title="Help & Support">
      <SettingGroup label="Frequently asked">
        {FAQ.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={i !== FAQ.length - 1 ? "border-b border-border" : ""}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <HelpCircle size={16} className="shrink-0 text-[var(--primary)]" />
                <span className="flex-1 text-[14px] font-medium text-foreground">{f.q}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} className="text-muted-foreground" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-3 pl-11 text-[13px] leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </SettingGroup>

      <SettingGroup label="Contact support">
        <form onSubmit={submit} className="space-y-3 p-4">
          <div>
            <label className="mb-1 block text-[12px] uppercase tracking-wider text-muted-foreground">
              Subject
            </label>
            <input
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              maxLength={100}
              className="w-full rounded-xl border border-border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-[color-mix(in_oklab,var(--primary)_40%,transparent)]"
              placeholder="What can we help with?"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] uppercase tracking-wider text-muted-foreground">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={4}
              maxLength={1000}
              className="w-full resize-none rounded-xl border border-border bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-[color-mix(in_oklab,var(--primary)_40%,transparent)]"
              placeholder="Describe the issue in detail…"
            />
            <p className="mt-1 text-right text-[11px] text-muted-foreground">
              {form.message.length}/1000
            </p>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Send size={15} /> Send message
          </button>
        </form>
      </SettingGroup>

      <SettingGroup label="More">
        <SettingItem
          icon={Mail}
          label="Email us"
          trailing="support@cryptvora.io"
          showArrow={false}
          onClick={() => {
            navigator.clipboard?.writeText("support@cryptvora.io");
            toast("Email copied");
          }}
        />
        <SettingItem
          icon={MessageSquare}
          label="Community forum"
          trailing="Open"
          onClick={() => toast("Opening forum…")}
        />
        <SettingItem
          icon={LifeBuoy}
          label="Status page"
          trailing="Operational"
          onClick={() => toast.success("All systems operational")}
        />
        <SettingItem
          icon={Info}
          label="Report a problem"
          onClick={() => toast("Report submitted")}
          last
        />
      </SettingGroup>
    </SettingsScreen>
  );
}
