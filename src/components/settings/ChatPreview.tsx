import { CHAT_WALLPAPERS } from "../../config/chatWallpapers";
import React from "react";
import {
  ArrowLeft,
  Search,
  Phone,
  Video,
  MoreVertical,
  Plus,
  Smile,
  Mic,
  FileText,
  Check,
  CheckCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "./SettingsContext";

const CryptvoraAppIcon = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100" height="100" rx="22" fill="#0A0A10" />
    <path
      d="M32 36 C12 36, 12 64, 32 64 C46 64, 50 50, 50 50 C50 50, 54 36, 68 36 C88 36, 88 64, 68 64 C54 64, 50 50, 50 50 C50 50, 46 36, 32 36 Z"
      fill="transparent"
      stroke="white"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChatPreview = React.memo(function ChatPreview() {
  const s = useSettings();
  const wallpaperUrl = CHAT_WALLPAPERS[s.wallpaper]?.url;

  return (
    <div
      suppressHydrationWarning
      className="relative flex flex-col w-full h-full overflow-hidden"
      style={{
        background: wallpaperUrl && wallpaperUrl !== "none" ? "transparent" : "var(--background)",
        transition: "background 0.4s ease",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Header */}
      {wallpaperUrl && wallpaperUrl !== "none" && (
        <div 
           className="absolute inset-0 z-0 pointer-events-none"
           style={{
             background: `url('${wallpaperUrl}') center/cover no-repeat, var(--background)`,
             filter: `blur(var(--app-blur))`,
             transform: `scale(1.1)`, // Prevent blurred edges from bleeding inwards
           }}
        />
      )}
      {/* Header */}
      <div
        className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:py-2.5 z-20 border-b relative"
        style={{
          background: "color-mix(in oklab, var(--surface) 85%, transparent)",
          borderColor: "var(--border)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft size={20} className="text-[var(--primary)]" />
        </button>
        <div className="flex flex-1 items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <CryptvoraAppIcon size={36} />
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface bg-green-500" />
          </div>
          <div className="flex flex-col min-w-0 flex-1 justify-center">
            <span className="text-[15px] sm:text-[16px] font-semibold leading-tight truncate">
              Cryptvora
            </span>
            <span className="text-[12px] sm:text-[13px] text-[var(--primary)] leading-tight truncate">
              online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 text-[var(--primary)]">
          <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
            <Phone size={19} strokeWidth={2} />
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
            <Video size={19} strokeWidth={2} />
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
            <MoreVertical size={19} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-3 relative z-10"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        <div className="flex justify-center mb-2">
          <span className="text-[12px] font-medium bg-black/20 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
            Today
          </span>
        </div>

        {/* Received Message */}
        <div className="flex flex-col gap-1 max-w-[85%] self-start relative">
          <div
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 text-[15px] sm:text-[15.5px] leading-snug rounded-[var(--bubble-radius)] rounded-bl-sm relative"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 1px 0 rgba(0,0,0,0.05) inset",
            }}
          >
            <div
              className="absolute -left-2 bottom-0 w-4 h-4"
              style={{
                background: "var(--surface)",
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                borderBottomRightRadius: "4px",
              }}
            />
            Can you send the Q3 volume report?
            <div className="float-right mt-[5px] ml-2 -mr-1 h-3.5 flex items-end">
              <span className="text-[10.5px] sm:text-[11px] font-medium text-muted-foreground leading-none">
                10:42 AM
              </span>
            </div>
          </div>
        </div>

        {/* Sent Message */}
        <div className="flex flex-col gap-1 max-w-[85%] self-end relative">
          <div
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 text-[15px] sm:text-[15.5px] leading-snug rounded-[var(--bubble-radius)] rounded-br-sm relative"
            style={{
              background: "var(--primary)",
              color: "white",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.15) inset",
            }}
          >
            <div
              className="absolute -right-2 bottom-0 w-4 h-4"
              style={{
                background: "var(--primary)",
                clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                borderBottomLeftRadius: "4px",
              }}
            />
            Sure, here is the file.
            <div className="float-right mt-[5px] ml-2 -mr-1 h-3.5 flex items-end gap-1">
              <span className="text-[10.5px] sm:text-[11px] font-medium text-white/80 leading-none">
                10:43 AM
              </span>
              <CheckCheck size={14} className="text-white opacity-90" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Sent Document Message */}
        <div className="flex flex-col gap-1 max-w-[85%] self-end relative">
          <div
            className="p-1 pr-3 sm:pr-4 text-[15px] sm:text-[15.5px] leading-snug rounded-[var(--bubble-radius)] rounded-br-sm relative flex items-center gap-3"
            style={{
              background: "var(--primary)",
              color: "white",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.15) inset",
            }}
          >
            <div
              className="absolute -right-2 bottom-0 w-4 h-4"
              style={{
                background: "var(--primary)",
                clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                borderBottomLeftRadius: "4px",
              }}
            />
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "color-mix(in oklab, white 20%, transparent)" }}
            >
              <FileText size={24} className="text-white" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-semibold truncate">Q3_Report_Final.pdf</span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] sm:text-[13px] text-white/80 truncate">
                  2.4 MB · PDF
                </span>
                <div className="flex items-center gap-1 ml-auto shrink-0">
                  <span className="text-[10.5px] sm:text-[11px] font-medium text-white/80">
                    10:43 AM
                  </span>
                  <CheckCheck size={14} className="text-white opacity-90" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div
        className="px-2 py-2 sm:px-3 sm:py-3 z-20"
        style={{
          background: "var(--background)",
        }}
      >
        <div className="flex items-end gap-1.5 sm:gap-2">
          <button className="h-[42px] w-[42px] shrink-0 flex items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 transition-colors">
            <Plus size={24} />
          </button>

          <div className="flex-1 bg-surface rounded-[24px] min-h-[42px] flex items-center px-1 border border-border/50 shadow-sm transition-all focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_1px_var(--primary)]">
            <button className="h-[34px] w-[34px] shrink-0 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors ml-0.5">
              <Smile size={22} />
            </button>
            <input
              placeholder="Message"
              className="flex-1 bg-transparent border-none outline-none text-[15px] sm:text-[16px] px-2 py-2.5 placeholder:text-muted-foreground h-full min-w-0"
              readOnly
            />
            <button className="h-[34px] w-[34px] shrink-0 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors mr-0.5">
              <Mic size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
