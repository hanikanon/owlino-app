import { createFileRoute } from "@tanstack/react-router";
import {
  AtSign,
  Badge,
  Bell,
  Heart,
  Mail,
  Megaphone,
  MessageSquare,
  Moon,
  Phone,
  PlayCircle,
  Radio,
  User,
  Users,
  Users2,
  Volume2,
  Vibrate,
} from "lucide-react";
import { toast } from "sonner";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { SettingItem } from "@/components/settings/SettingItem";
import { RowToggle } from "@/components/settings/rows";
import { useSettings } from "@/components/settings/SettingsContext";
import { playNotificationSound, vibrateDevice } from "@/lib/native-feedback";

export const Route = createFileRoute("/settings/notifications")({
  component: Page,
});

function Page() {
  const { prefs, setPref } = useSettings();
  return (
    <SettingsScreen title="Notifications">
      <SettingGroup
        label="Show notifications for"
        footer="Turn this off if you want to receive notifications only from your active account."
      >
        <RowToggle
          icon={User}
          label="All accounts"
          description="Turn off to only receive notifications from your active account"
          checked={prefs.showNotificationsAllAccounts}
          onChange={(v) => setPref("showNotificationsAllAccounts", v)}
          last
        />
      </SettingGroup>

      <SettingGroup label="Push">
        <RowToggle
          icon={MessageSquare}
          label="Messages"
          checked={prefs.pushMessages}
          onChange={(v) => setPref("pushMessages", v)}
        />
        <RowToggle
          icon={AtSign}
          label="Mentions & replies"
          checked={prefs.pushMentions}
          onChange={(v) => setPref("pushMentions", v)}
        />
        <RowToggle
          icon={Phone}
          label="Calls"
          checked={prefs.pushCalls}
          onChange={(v) => setPref("pushCalls", v)}
        />
        <RowToggle
          icon={Users}
          label="Groups"
          checked={prefs.pushGroups}
          onChange={(v) => setPref("pushGroups", v)}
        />
        <RowToggle
          icon={Radio}
          label="Channels"
          checked={prefs.pushChannels}
          onChange={(v) => setPref("pushChannels", v)}
          last
        />
      </SettingGroup>

      <SettingGroup label="Notifications for chats">
        <RowToggle
          icon={User}
          label="Private Chats"
          description="Tap to change"
          checked={prefs.notifPrivateChats}
          onChange={(v) => setPref("notifPrivateChats", v)}
        />
        <RowToggle
          icon={Users}
          label="Groups"
          description="On, 1 exceptions"
          checked={prefs.notifGroupsDetail}
          onChange={(v) => setPref("notifGroupsDetail", v)}
        />
        <RowToggle
          icon={Megaphone}
          label="Channels"
          description="On, 1 exception"
          checked={prefs.notifChannelsDetail}
          onChange={(v) => setPref("notifChannelsDetail", v)}
        />
        <RowToggle
          icon={PlayCircle}
          label="Stories"
          description="Off, 1 exceptions"
          checked={prefs.notifStories}
          onChange={(v) => setPref("notifStories", v)}
        />
        <RowToggle
          icon={Heart}
          label="Reactions"
          description="Messages, Stories"
          checked={prefs.notifReactions}
          onChange={(v) => setPref("notifReactions", v)}
          last
        />
      </SettingGroup>

      <SettingGroup label="In-app">
        <RowToggle
          icon={Volume2}
          label="Sounds"
          checked={prefs.inAppSounds}
          onChange={(v) => {
            setPref("inAppSounds", v);
            if (v) {
              void playNotificationSound();
              toast.success("Sound enabled — playing preview");
            }
          }}
        />
        <RowToggle
          icon={Vibrate}
          label="Vibrate"
          checked={prefs.vibrate}
          onChange={(v) => {
            setPref("vibrate", v);
            if (v) {
              const ok = vibrateDevice([40, 30, 90]);
              toast.success(ok ? "Vibration enabled" : "Vibration not supported on this device");
            }
          }}
        />

        <RowToggle
          icon={Bell}
          label="Show message preview"
          description="Display sender & content in banners"
          checked={prefs.notificationPreview}
          onChange={(v) => setPref("notificationPreview", v)}
          last
        />
      </SettingGroup>

      <SettingGroup
        label="Digest"
        footer="Quiet hours will automatically mute all notifications during the specified time."
      >
        <RowToggle
          icon={Mail}
          label="Weekly email digest"
          description="Summary of your week, every Monday"
          checked={prefs.emailDigest}
          onChange={(v) => setPref("emailDigest", v)}
        />
        <RowToggle
          icon={Moon}
          label="Quiet hours"
          description="Mute notifications 10:00 PM – 7:00 AM"
          checked={prefs.quietHours}
          onChange={(v) => setPref("quietHours", v)}
          last
        />
      </SettingGroup>
    </SettingsScreen>
  );
}
