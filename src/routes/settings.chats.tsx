import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Database,
  ImageIcon,
  Link2,
  MessageSquare,
  Palette,
  SpellCheck,
  Save,
  Film,
  FileText,
  SmartphoneNfc,
} from "lucide-react";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { SettingItem } from "@/components/settings/SettingItem";
import { RowToggle } from "@/components/settings/rows";
import { useSettings } from "@/components/settings/SettingsContext";

export const Route = createFileRoute("/settings/chats")({
  component: Page,
});

function Page() {
  const { prefs, setPref } = useSettings();
  const navigate = useNavigate();
  return (
    <SettingsScreen title="Chats">
      <SettingGroup label="Composer">
        <RowToggle
          icon={MessageSquare}
          label="Enter to send"
          description="Return sends, Shift+Return adds a line"
          checked={prefs.enterToSend}
          onChange={(v) => setPref("enterToSend", v)}
        />
        <RowToggle
          icon={Link2}
          label="Show link previews"
          checked={prefs.linkPreviews}
          onChange={(v) => setPref("linkPreviews", v)}
        />
        <RowToggle
          icon={SpellCheck}
          label="Spell check"
          checked={prefs.spellCheck}
          onChange={(v) => setPref("spellCheck", v)}
          last
        />
      </SettingGroup>

      <SettingGroup label="Auto-download">
        <RowToggle
          icon={ImageIcon}
          label="Photos"
          checked={prefs.autoDownloadPhotos}
          onChange={(v) => setPref("autoDownloadPhotos", v)}
        />
        <RowToggle
          icon={Film}
          label="Videos"
          checked={prefs.autoDownloadVideos}
          onChange={(v) => setPref("autoDownloadVideos", v)}
        />
        <RowToggle
          icon={FileText}
          label="Files"
          checked={prefs.autoDownloadFiles}
          onChange={(v) => setPref("autoDownloadFiles", v)}
        />
        <RowToggle
          icon={SmartphoneNfc}
          label="Use mobile data"
          description="Otherwise Wi-Fi only"
          checked={prefs.autoDownloadOnMobile}
          onChange={(v) => setPref("autoDownloadOnMobile", v)}
        />
        <RowToggle
          icon={Save}
          label="Save to gallery"
          description="Auto-save incoming photos"
          checked={prefs.saveToGallery}
          onChange={(v) => setPref("saveToGallery", v)}
          last
        />
      </SettingGroup>

      <SettingGroup label="Appearance">
        <SettingItem
          icon={Palette}
          label="Open Appearance"
          description="Theme, wallpaper, text size"
          onClick={() => navigate({ to: "/settings/chat-wallpapers" })}
        />
        <SettingItem
          icon={Database}
          label="Manage storage"
          onClick={() => navigate({ to: "/settings/storage" })}
          last
        />
      </SettingGroup>
    </SettingsScreen>
  );
}
