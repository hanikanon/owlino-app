import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { FolderPlus, GripVertical, Pencil, Plus, Tag, Trash2, X, Lock } from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { SettingItem } from "@/components/settings/SettingItem";
import { Toggle } from "@/components/settings/Toggle";
import { RowToggle } from "@/components/settings/rows";
import { useSettings, type ChatFolder } from "@/components/settings/SettingsContext";

export const Route = createFileRoute("/settings/folders")({
  component: Page,
});

const EMOJIS = ["💬", "👤", "👥", "📢", "💰", "⭐", "🔥", "🎯", "📈", "📚", "🎮", "🛒", "✈️", "❤️"];

const RECOMMENDED: ChatFolder[] = [
  { id: "unread", name: "Unread", emoji: "📩" },
  { id: "private", name: "Private", emoji: "🔒" },
  { id: "channels", name: "Channels", emoji: "📢" },
  { id: "media", name: "Media", emoji: "🖼️" },
];

function Page() {
  const { folders, addFolder, removeFolder, renameFolder, reorderFolders, prefs, setPref } =
    useSettings();
  const [editing, setEditing] = useState<ChatFolder | null>(null);
  const [creating, setCreating] = useState(false);

  const reorder = (next: ChatFolder[]) => {
    // find first mismatch
    const from = folders.findIndex((f, i) => f.id !== next[i]?.id);
    if (from < 0) return;
    const to = next.findIndex((f) => f.id === folders[from].id);
    reorderFolders(from, to);
  };

  const notAdded = RECOMMENDED.filter((r) => !folders.some((f) => f.id === r.id));

  return (
    <SettingsScreen title="Folders">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }} className="mx-6 mb-3 flex flex-col items-center text-center"
      >
        <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl text-[30px]"
          style={{
            background: "color-mix(in oklab, var(--primary) 12%, transparent)",
          }}
        >
          📁
        </span>
        <p className="text-[12.5px] leading-relaxed text-muted-foreground max-w-[280px]">
          Create folders for different groups of chats and quickly switch between them.
        </p>
      </motion.div>

      {notAdded.length > 0 && (
        <SettingGroup label="Recommended folders">
          {notAdded.map((f, i) => (
            <div
              key={f.id}
              className={`flex items-center gap-3 px-4 py-3 ${i < notAdded.length - 1 ? "border-b border-border" : ""}`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-[20px]"
                style={{
                  background: "color-mix(in oklab, var(--foreground) 5%, transparent)",
                }}
              >
                {f.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-foreground">{f.name}</p>
                <p className="text-[12px] text-muted-foreground">Tap Add to include this folder.</p>
              </div>
              <button onClick={() => {
                  addFolder(f);
                  toast.success(`${f.name} added`);
                }} className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-[var(--primary-foreground)]"
                style={{ background: "var(--gradient-brand)" }}
              >
                Add
              </button>
            </div>
          ))}
        </SettingGroup>
      )}

      <SettingGroup label={`Your folders · ${folders.length}`}>
        <Reorder.Group axis="y" values={folders} onReorder={reorder} className="w-full">
          {folders.map((f, i) => (
            <Reorder.Item
              key={f.id}
              value={f}
              className={`flex items-center gap-3 bg-transparent px-4 py-3 ${
                i < folders.length - 1 ? "border-b border-border" : ""
              }`}
              whileDrag={{
                scale: 1.02,
                boxShadow: "0 12px 30px rgb(0 0 0 / 0.25)",
              }}
            >
              <GripVertical size={16} className="cursor-grab text-muted-foreground/70" />
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-[20px]"
                style={{
                  background: "color-mix(in oklab, var(--primary) 10%, transparent)",
                }}
              >
                {f.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-semibold text-foreground">{f.name}</p>
                <p className="text-[12px] text-muted-foreground">
                  {f.id === "all" ? "" : "Tap to edit"}
                </p>
              </div>
              {f.id !== "all" && (
                <>
                  <button onClick={() => setEditing(f)} className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
                    aria-label="Rename"
                  >
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => {
                      removeFolder(f.id);
                      toast.success(`${f.name} removed`);
                    }} className="flex h-9 w-9 items-center justify-center rounded-full text-destructive hover:bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)]"
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <button onClick={() => setCreating(true)} className="flex w-full items-center justify-between gap-3 border-t border-border/40 px-4 py-3 text-left"
        >
          <span className="text-[14.5px] font-medium text-[var(--primary)]">Create New Folder</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full text-white"
            style={{ background: "var(--primary)" }}
          >
            <Plus size={16} />
          </span>
        </button>
      </SettingGroup>

      <SettingGroup label="Display">
        <SettingItem
          icon={Lock}
          label="Show Folder Tags"
          showArrow={false}
          trailing={
            <Toggle
              checked={prefs.showFolderTags}
              onChange={(v) => setPref("showFolderTags", v)}
              label="Show Folder Tags"
            />
          }
          last
        />
      </SettingGroup>

      <p className="px-5 text-center text-[12.5px] text-muted-foreground mt-[-10px] mb-8">
        Subscribe to <strong className="text-foreground">Telegram Premium</strong> to display folder
        names for each chat in the chat list.
      </p>

      <AnimatePresence>
        {(editing || creating) && (
          <FolderSheet
            initial={editing ?? undefined}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
            onSave={(name, emoji) => {
              if (editing) {
                renameFolder(editing.id, name);
                toast.success("Folder updated");
              } else {
                addFolder({ id: `f-${Date.now()}`, name, emoji });
                toast.success(`${name} created`);
              }
              setEditing(null);
              setCreating(false);
            }}
          />
        )}
      </AnimatePresence>
    </SettingsScreen>
  );
}

function FolderSheet({
  initial,
  onClose,
  onSave,
}: {
  initial?: ChatFolder;
  onClose: () => void;
  onSave: (name: string, emoji: string) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? EMOJIS[0]);
  const canSave = name.trim().length > 0;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()} className="w-full max-w-[520px] rounded-t-3xl border-t border-border bg-[var(--surface)] p-5 shadow-2xl"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 20px)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[16px] font-semibold text-foreground">
            {initial ? "Edit folder" : "New folder"}
          </p>
          <button
            onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[28px]"
            style={{
              background: "color-mix(in oklab, var(--primary) 12%, transparent)",
            }}
          >
            {emoji}
          </span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name" className="w-full rounded-xl border border-border bg-transparent px-3.5 py-3 text-[15px] text-foreground outline-none focus:border-[var(--primary)]"
            maxLength={24}
          />
        </div>
        <p className="mb-2 mt-2 text-[12px] uppercase tracking-wider text-muted-foreground">Icon</p>
        <div className="mb-4 grid grid-cols-7 gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`flex aspect-square items-center justify-center rounded-xl text-[20px] transition-colors ${
                emoji === e
                  ? "ring-2 ring-[var(--primary)]"
                  : "hover:bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)]"
              }`}
              style={{
                background:
                  emoji === e
                    ? "color-mix(in oklab, var(--primary) 14%, transparent)"
                    : "transparent",
              }}
            >
              {e}
            </button>
          ))}
        </div>
        <button
          disabled={!canSave}
          onClick={() => onSave(name.trim(), emoji)} className="w-full rounded-xl py-3 text-[14.5px] font-semibold text-white disabled:opacity-40"
          style={{ background: "var(--gradient-brand)" }}
        >
          {initial ? "Save changes" : "Create folder"}
        </button>
      </motion.div>
    </motion.div>
  );
}
