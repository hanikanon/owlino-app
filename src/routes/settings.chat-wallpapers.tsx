import { createFileRoute } from "@tanstack/react-router";
import { SettingsScreen } from "../components/settings/SettingsScreen";
import { useSettings, ThemeId, AccentId, BubbleStyle, FontSize } from "../components/settings/SettingsContext";
import { CHAT_WALLPAPERS, type ChatWallpaperId } from "../config/chatWallpapers";
import { Check, } from "lucide-react";
import { ChatPreview } from "../components/settings/ChatPreview";
import { SettingGroup } from "../components/settings/SettingGroup";
import { Slider } from "../components/ui/slider";

export const Route = createFileRoute("/settings/chat-wallpapers")({
  component: ChatWallpapersRoute,
});

function ChatWallpapersRoute() {
  const s = useSettings();

  const themes: { id: ThemeId; name: string }[] = [
    { id: "dark", name: "Dark" },
    { id: "midnight", name: "Midnight" },
    { id: "amoled", name: "AMOLED" },
    { id: "dracula", name: "Dracula" },
    { id: "nord", name: "Nord" },
    { id: "light", name: "Light" },
    { id: "cream", name: "Cream" },
  ];

  const accents: { id: AccentId; color: string }[] = [
    { id: "blue", color: "#3b82f6" },
    { id: "indigo", color: "#6366f1" },
    { id: "violet", color: "#8b5cf6" },
    { id: "purple", color: "#a855f7" },
    { id: "pink", color: "#ec4899" },
    { id: "rose", color: "#f43f5e" },
    { id: "red", color: "#ef4444" },
    { id: "orange", color: "#f97316" },
    { id: "amber", color: "#f59e0b" },
  ];

  const bubbleStyles: { id: BubbleStyle; name: string }[] = [
    { id: "rounded", name: "Rounded" },
    { id: "modern", name: "Modern" },
    { id: "square", name: "Square" },
    { id: "tail", name: "Tail" },
  ];
  
  const fontSizes: { id: FontSize; name: string }[] = [
    { id: "small", name: "Small" },
    { id: "medium", name: "Medium" },
    { id: "large", name: "Large" },
    { id: "xl", name: "Extra Large" },
  ];

  return (
    <SettingsScreen title="Appearance & Chat">
      <div className="h-[300px] w-full shrink-0 border-b border-border/50 bg-background sticky top-[52px] z-30 shadow-sm">
        <ChatPreview />
      </div>
      <div className="p-4 space-y-6">
        <SettingGroup label="Wallpaper">
          <div className="grid grid-cols-3 gap-2 p-3">
            {(Object.keys(CHAT_WALLPAPERS) as ChatWallpaperId[]).map((id) => {
              const w = CHAT_WALLPAPERS[id];
              const active = s.wallpaper === id;
              return (
                <button
                  key={id}
                  onClick={() => s.setWallpaper(id)}
                  className="relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl border-2 p-2 text-left transition-all"
                  style={{
                    background: w.url === "none" ? "var(--surface-2)" : `url('${w.url}') center/cover no-repeat, var(--surface-2)`,
                    borderColor: active ? "var(--primary)" : "transparent",
                  }}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <span className="relative rounded-lg bg-black/40 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    {w.name}
                  </span>
                  {active && (
                    <span
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm"
                      style={{ background: "var(--primary)" }}
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {s.wallpaper !== "none" && (
            <div className="px-4 py-4 border-t border-border/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-medium">Wallpaper Blur</span>
                <span className="text-[13px] text-muted-foreground">{s.blur}px</span>
              </div>
              <Slider 
                value={[s.blur]} 
                min={0} 
                max={40} 
                step={2} 
                onValueChange={(v) => s.setBlur(v[0])} 
              />
            </div>
          )}
        </SettingGroup>

        <SettingGroup label="Theme & Accent">
          <div className="px-4 py-3">
             <div className="flex flex-wrap gap-2 mb-4">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => s.setTheme(t.id)}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors border"
                  style={{
                    background: s.theme === t.id ? "var(--primary-soft)" : "transparent",
                    color: s.theme === t.id ? "var(--primary)" : "var(--muted-foreground)",
                    borderColor: s.theme === t.id ? "var(--primary)" : "var(--border)",
                  }}
                >
                  {t.name}
                </button>
              ))}
             </div>
             
             <div className="flex flex-wrap gap-3 pt-3 border-t border-border/50">
               {accents.map(a => (
                 <button
                   key={a.id}
                   onClick={() => s.setAccent(a.id)}
                   className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                   style={{ background: a.color }}
                 >
                   {s.accent === a.id && <Check size={16} color="white" strokeWidth={3} />}
                 </button>
               ))}
             </div>
          </div>
        </SettingGroup>

        <SettingGroup label="Chat Bubbles">
          <div className="px-4 py-4 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-medium">Bubble Radius</span>
                <span className="text-[13px] text-muted-foreground">{s.radius}px</span>
              </div>
              <Slider 
                value={[s.radius]} 
                min={4} 
                max={28} 
                step={2} 
                onValueChange={(v) => s.setRadius(v[0])} 
              />
            </div>
          </div>
        </SettingGroup>

        <SettingGroup label="Text Size">
           <div className="flex flex-wrap gap-2 p-3">
              {fontSizes.map(f => (
                <button
                  key={f.id}
                  onClick={() => s.setFontSize(f.id)}
                  className="flex-1 px-2 py-2 rounded-lg text-[13px] font-medium transition-colors border text-center"
                  style={{
                    background: s.fontSize === f.id ? "var(--primary-soft)" : "transparent",
                    color: s.fontSize === f.id ? "var(--primary)" : "var(--muted-foreground)",
                    borderColor: s.fontSize === f.id ? "var(--primary)" : "var(--border)",
                  }}
                >
                  {f.name}
                </button>
              ))}
             </div>
        </SettingGroup>
      </div>
    </SettingsScreen>
  );
}
