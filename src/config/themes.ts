export type ThemeId =  | "amoled"  | "midnight"  | "dark"  | "dracula"  | "nord"  | "ocean"  | "aurora"  | "glass"  | "monokai"  | "mocha" | "light" | "cream" | "warmGray";
export type AccentId =  | "blue"  | "indigo"  | "violet"  | "purple"  | "fuchsia"  | "pink"  | "rose"  | "red"  | "orange"  | "amber";
export type BubbleStyle = "rounded" | "modern" | "square" | "tail";
export type FontSize = "small" | "medium" | "large" | "xl";
export type Motion = "normal" | "fast" | "reduced";
export type AppIcon = "aurora" | "midnight" | "prism" | "mono";

export const BADGES = [
  { id: "none", label: "None", from: "transparent", to: "transparent", description: "No badge" },
  { id: "official", label: "Official", from: "oklch(0.6 0.2 260)", to: "oklch(0.5 0.2 260)", description: "Official Cryptvora accounts." },
  { id: "verified", label: "Verified", from: "var(--primary)", to: "var(--primary-glow)", description: "Verified user account." },
  { id: "premium", label: "Premium", from: "oklch(0.7 0.15 40)", to: "oklch(0.6 0.15 40)", description: "Cryptvora Premium subscriber." },
  { id: "creator", label: "Creator", from: "oklch(0.6 0.2 330)", to: "oklch(0.5 0.2 330)", description: "Recognized content creator." },
  { id: "analyst", label: "Analyst", from: "oklch(0.65 0.15 150)", to: "oklch(0.55 0.15 150)", description: "Market analyst." },
  { id: "educator", label: "Educator", from: "oklch(0.6 0.15 200)", to: "oklch(0.5 0.15 200)", description: "Educational contributor." },
  { id: "partner", label: "Partner", from: "oklch(0.6 0.15 80)", to: "oklch(0.5 0.15 80)", description: "Official partner." },
  { id: "top-trader", label: "Top Trader", from: "oklch(0.6 0.15 20)", to: "oklch(0.5 0.15 20)", description: "High volume trader." },
];

export const THEMES: Record<ThemeId, any> = {
  amoled: { bg: "#000", fg: "#fff", surface: "#111", surface2: "#222", muted: "#888", border: "#333", scheme: "dark" },
  midnight: { bg: "#0f172a", fg: "#fff", surface: "#1e293b", surface2: "#334155", muted: "#94a3b8", border: "#334155", scheme: "dark" },
  dark: { bg: "#09090b", fg: "#fafafa", surface: "#18181b", surface2: "#27272a", muted: "#a1a1aa", border: "#27272a", scheme: "dark" },
  dracula: { bg: "#282a36", fg: "#f8f8f2", surface: "#44475a", surface2: "#6272a4", muted: "#6272a4", border: "#44475a", scheme: "dark" },
  nord: { bg: "#2e3440", fg: "#eceff4", surface: "#3b4252", surface2: "#434c5e", muted: "#d8dee9", border: "#434c5e", scheme: "dark" },
  ocean: { bg: "#0f172a", fg: "#f8fafc", surface: "#1e293b", surface2: "#334155", muted: "#94a3b8", border: "#334155", scheme: "dark" },
  aurora: { bg: "#101014", fg: "#fff", surface: "#1a1a24", surface2: "#2a2a36", muted: "#888", border: "#2a2a36", scheme: "dark" },
  glass: { bg: "#000", fg: "#fff", surface: "rgba(255,255,255,0.1)", surface2: "rgba(255,255,255,0.2)", muted: "#aaa", border: "rgba(255,255,255,0.1)", scheme: "dark" },
  monokai: { bg: "#272822", fg: "#f8f8f2", surface: "#3e3d32", surface2: "#49483e", muted: "#75715e", border: "#49483e", scheme: "dark" },
  mocha: { bg: "#1e1e2e", fg: "#cdd6f4", surface: "#313244", surface2: "#45475a", muted: "#a6adc8", border: "#45475a", scheme: "dark" },
  light: { bg: "#ffffff", fg: "#09090b", surface: "#f4f4f5", surface2: "#e4e4e7", muted: "#71717a", border: "#e4e4e7", scheme: "light" },
  cream: { bg: "#fdf6e3", fg: "#657b83", surface: "#eee8d5", surface2: "#93a1a1", muted: "#586e75", border: "#eee8d5", scheme: "light" },
  warmGray: { bg: "#f5f5f4", fg: "#1c1917", surface: "#e7e5e4", surface2: "#d6d3d1", muted: "#78716c", border: "#d6d3d1", scheme: "light" },
};

export const ACCENTS: Record<AccentId, any> = {
  blue: { value: "#3b82f6", glow: "#60a5fa", soft: "rgba(59,130,246,0.1)" },
  indigo: { value: "#6366f1", glow: "#818cf8", soft: "rgba(99,102,241,0.1)" },
  violet: { value: "#8b5cf6", glow: "#a78bfa", soft: "rgba(139,92,246,0.1)" },
  purple: { value: "#a855f7", glow: "#c084fc", soft: "rgba(168,85,247,0.1)" },
  fuchsia: { value: "#d946ef", glow: "#e879f9", soft: "rgba(217,70,239,0.1)" },
  pink: { value: "#ec4899", glow: "#f472b6", soft: "rgba(236,72,153,0.1)" },
  rose: { value: "#f43f5e", glow: "#fb7185", soft: "rgba(244,63,94,0.1)" },
  red: { value: "#ef4444", glow: "#f87171", soft: "rgba(239,68,68,0.1)" },
  orange: { value: "#f97316", glow: "#fb923c", soft: "rgba(249,115,22,0.1)" },
  amber: { value: "#f59e0b", glow: "#fbbf24", soft: "rgba(245,158,11,0.1)" },
};

export function themeStyle(
  theme: ThemeId,
  accent: AccentId,
  radius: number,
  fontSize: FontSize,
  blur = 22,
): React.CSSProperties {
  const t = THEMES[theme] || THEMES.dark;
  const a = ACCENTS[accent] || ACCENTS.blue;
  const fs = { small: 14, medium: 15.5, large: 17, xl: 18.5 }[fontSize] || 15.5;
  return {
    ["--background" as string]: t.bg,
    ["--foreground" as string]: t.fg,
    ["--surface" as string]: t.surface,
    ["--surface-2" as string]: t.surface2,
    ["--surface-3" as string]: t.surface2,
    ["--card" as string]: t.surface,
    ["--popover" as string]: t.surface,
    ["--muted" as string]: t.surface,
    ["--muted-foreground" as string]: t.muted,
    ["--accent" as string]: t.surface2,
    ["--border" as string]: t.border,
    ["--border-strong" as string]: t.border,
    ["--input" as string]: t.border,
    ["--primary" as string]: a.value,
    ["--primary-glow" as string]: a.glow,
    ["--primary-soft" as string]: a.soft,
    ["--ring" as string]: a.soft,
    ["--gradient-brand" as string]: `linear-gradient(135deg, ${a.value} 0%, ${a.glow} 100%)`,
    ["--radius" as string]: `${radius}px`,
    ["--bubble-radius" as string]: `${radius}px`,
    ["--app-font-size" as string]: `${fs}px`,
    ["--app-blur" as string]: `${blur}px`,
    colorScheme: t.scheme,
    fontSize: `${fs}px`,
  };
}
