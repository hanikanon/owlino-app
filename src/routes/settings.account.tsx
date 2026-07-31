import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AtSign, Mail, Phone, User, UserX, KeyRound, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SettingsScreen } from "@/components/settings/SettingsScreen";
import { SettingGroup } from "@/components/settings/SettingGroup";
import { SettingItem } from "@/components/settings/SettingItem";
import { useSettings } from "@/components/settings/SettingsContext";

export const Route = createFileRoute("/settings/account")({
  component: Page,
});

function Page() {
  const { profile } = useSettings();
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    toast(`${label} copied`);
    setTimeout(() => setCopied(null), 1400);
  };
  return (
    <SettingsScreen title="Account">
      <SettingGroup label="Identity">
        <SettingItem
          icon={AtSign}
          label="Username"
          trailing={
            <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              @{profile.username}
              {copied === "Username" ? <Check size={14} /> : <Copy size={14} />}
            </span>
          }
          showArrow={false}
          onClick={() => copy("Username", `@${profile.username}`)}
        />
        <SettingItem
          icon={Phone}
          label="Phone"
          trailing={profile.phone}
          onClick={() => copy("Phone", profile.phone)}
          showArrow={false}
        />
        <SettingItem
          icon={Mail}
          label="Email"
          trailing={profile.email}
          onClick={() => copy("Email", profile.email)}
          showArrow={false}
          last
        />
      </SettingGroup>

      <SettingGroup label="Actions">
        <SettingItem
          icon={User}
          label="Edit profile"
          description="Name, bio, socials, badge"
          onClick={() => navigate({ to: "/settings/edit-profile" })}
        />
        <SettingItem
          icon={KeyRound}
          label="Change password"
          onClick={() => navigate({ to: "/settings/security" })}
          last
        />
      </SettingGroup>

      <SettingGroup label="Danger zone">
        <SettingItem
          icon={UserX}
          label="Delete account"
          description="Permanently remove your account and data"
          danger
          showArrow={false}
          last
          onClick={() =>
            toast("Are you sure?", {
              description: "This will delete your account permanently.",
              action: {
                label: "Delete",
                onClick: () => toast.error("Account deletion queued"),
              },
            })
          }
        />
      </SettingGroup>
    </SettingsScreen>
  );
}
