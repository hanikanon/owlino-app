
import { createContext, useContext, useMemo, useState, useCallback, ReactNode, useEffect, useLayoutEffect } from "react";
import { CHAT_WALLPAPERS, DEFAULT_CHAT_WALLPAPER_ID, type ChatWallpaperId } from "../../config/chatWallpapers";

import { ThemeId, AccentId, BubbleStyle, FontSize, Motion, AppIcon } from "../../config/themes";

// Custom hook for local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(error);
    }
  };
  return [storedValue, setValue] as const;
}

export type SocialPlatform = "twitter" | "telegram" | "discord" | "github" | "tradingview" | "youtube" | "instagram" | "linkedin" | "website";

export type Profile = {
  displayName: string;
  username: string;
  bio: string;
  phone: string;
  email: string;
  website: string;
  birthday: string;
  location: string;
  avatarColor: string;
  coverGradient: string;
  verified: boolean;
  online: boolean;
  cryptoId: string;
  walletAddress: string;
  walletChain: string;
  socials: Partial<Record<SocialPlatform, string>>;
  badge: string;
  availableBadges: string[];
};

export type AutoLockValue = "off" | "1m" | "5m" | "1h" | "5h";

export type Prefs = {
  readReceipts: boolean;
  lastSeen: boolean;
  typingIndicator: boolean;
  profilePhotoVisibility: "everyone" | "contacts" | "nobody";
  phoneVisibility: "everyone" | "contacts" | "nobody";
  blockScreenshots: boolean;
  disappearingMessages: "off" | "24h" | "7d" | "30d";
  pushMessages: boolean;
  pushMentions: boolean;
  pushCalls: boolean;
  pushGroups: boolean;
  pushChannels: boolean;
  emailDigest: boolean;
  inAppSounds: boolean;
  vibrate: boolean;
  notificationPreview: boolean;
  quietHours: boolean;
  enterToSend: boolean;
  autoDownloadPhotos: boolean;
  autoDownloadVideos: boolean;
  autoDownloadFiles: boolean;
  autoDownloadOnMobile: boolean;
  saveToGallery: boolean;
  linkPreviews: boolean;
  spellCheck: boolean;
  biometric: boolean;
  twoFactor: boolean;
  autoLock: AutoLockValue;
  loginAlerts: boolean;
  pin: string | null;
  password: string | null;
  recoveryEmail: string;
  recoveryPhone: string;
  backupMethod: "none" | "email" | "phone" | "google";
  language: string;
  region: string;
  timeFormat: "12h" | "24h";
  translateButton: boolean;
  translateEntireChat: boolean;
  notifPrivateChats: boolean;
  notifGroupsDetail: boolean;
  notifChannelsDetail: boolean;
  notifStories: boolean;
  notifReactions: boolean;
  badgeCounter: boolean;
  showNotificationsAllAccounts: boolean;
  autoDownloadWifi: boolean;
  autoDownloadRoaming: boolean;
  saveToGalleryPrivate: boolean;
  saveToGalleryGroups: boolean;
  saveToGalleryChannels: boolean;
  lowPowerMode: "off" | "on" | "auto";
  lowPowerThreshold: number;
  animatedStickers: boolean;
  animatedEmoji: boolean;
  chatEffects: boolean;
  callAnimations: boolean;
  autoplayVideos: boolean;
  autoplayGifs: boolean;
  particles: boolean;
  smoothTransitions: boolean;
  showFolderTags: boolean;
};

export type ChatFolder = { id: string; name: string; emoji: string };
export type BlockedDevice = {
  id: string;
  name: string;
  os: string;
  app: string;
  city: string;
  country: string;
  blockedAt: string;
  accent: string;
};









type SettingsContextType = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  accent: AccentId;
  setAccent: (a: AccentId) => void;
  radius: number;
  setRadius: (r: number) => void;
  bubble: BubbleStyle;
  setBubble: (b: BubbleStyle) => void;
  fontSize: FontSize;
  setFontSize: (fs: FontSize) => void;
  blur: number;
  setBlur: (b: number) => void;
  motion: Motion;
  setMotion: (m: Motion) => void;
  appIcon: AppIcon;
  setAppIcon: (i: AppIcon) => void;
  
  wallpaper: ChatWallpaperId;
  setWallpaper: (v: ChatWallpaperId) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
  updateSocial: (platform: SocialPlatform, url: string | null) => void;
  prefs: Prefs;
  setPref: <K extends keyof Prefs>(k: K, v: Prefs[K]) => void;
  blockedDevices: BlockedDevice[];
  blockDevice: (d: BlockedDevice) => void;
  unblockDevice: (id: string) => void;
  folders: ChatFolder[];
  addFolder: (f: ChatFolder) => void;
  renameFolder: (id: string, name: string) => void;
  removeFolder: (id: string) => void;
  reorderFolders: (from: number, to: number) => void;
};

const SettingsCtx = createContext<SettingsContextType | null>(null);

const DEFAULT_PROFILE: Profile = {
  displayName: "Alex Morgan",
  username: "alex.morgan",
  bio: "Building alpha, one candle at a time. Crypto trader · DeFi native.",
  phone: "+1 (555) 018-2201",
  email: "alex@cryptvora.io",
  website: "cryptvora.io/alex",
  birthday: "1996-04-12",
  location: "Lisbon, Portugal",
  avatarColor: "var(--gradient-brand)",
  coverGradient: "linear-gradient(135deg, color-mix(in oklab, var(--primary) 65%, transparent), color-mix(in oklab, var(--primary-glow) 55%, transparent))",
  verified: true,
  online: true,
  cryptoId: "CV-8QF3-27M9-A0LP",
  walletAddress: "0x8fA4…C21e",
  walletChain: "Ethereum",
  socials: {
    twitter: "https://x.com/alexmorgan",
    telegram: "https://t.me/alexmorgan",
    discord: "https://discord.com/users/alex.cv",
    github: "https://github.com/alexmorgan",
    tradingview: "https://tradingview.com/u/alexmorgan",
  },
  badge: "verified",
  availableBadges: ["none", "official", "verified", "premium", "creator", "analyst", "educator", "partner", "top-trader"],
};

const DEFAULT_PREFS: Prefs = {
  readReceipts: true,
  lastSeen: true,
  typingIndicator: true,
  profilePhotoVisibility: "everyone",
  phoneVisibility: "contacts",
  blockScreenshots: false,
  disappearingMessages: "off",
  pushMessages: true,
  pushMentions: true,
  pushCalls: true,
  pushGroups: true,
  pushChannels: false,
  emailDigest: false,
  inAppSounds: true,
  vibrate: false,
  notificationPreview: true,
  quietHours: false,
  enterToSend: true,
  autoDownloadPhotos: true,
  autoDownloadVideos: false,
  autoDownloadFiles: false,
  autoDownloadOnMobile: false,
  saveToGallery: false,
  linkPreviews: true,
  spellCheck: true,
  biometric: true,
  twoFactor: false,
  autoLock: "5m",
  loginAlerts: true,
  pin: null,
  password: null,
  recoveryEmail: "",
  recoveryPhone: "",
  backupMethod: "none",
  language: "English",
  region: "Portugal",
  timeFormat: "24h",
  translateButton: false,
  translateEntireChat: false,
  notifPrivateChats: true,
  notifGroupsDetail: true,
  notifChannelsDetail: false,
  notifStories: false,
  notifReactions: true,
  badgeCounter: true,
  showNotificationsAllAccounts: true,
  autoDownloadWifi: true,  autoDownloadRoaming: false,
  saveToGalleryPrivate: false,  saveToGalleryGroups: false,  saveToGalleryChannels: false,
  lowPowerMode: "auto",  lowPowerThreshold: 20,
  animatedStickers: true,  animatedEmoji: true,  chatEffects: true,
  callAnimations: true,  autoplayVideos: true,  autoplayGifs: true,
  particles: true,  smoothTransitions: true,  showFolderTags: false,
};

const DEFAULT_FOLDERS: ChatFolder[] = [
  { id: "all", name: "All Chats", emoji: "💬" },
  { id: "personal", name: "Personal", emoji: "👤" },
  { id: "crypto", name: "Crypto", emoji: "💰" },
];

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<ThemeId>("app_theme", "dark");
  const [accent, setAccent] = useLocalStorage<AccentId>("app_accent", "blue");
  const [radius, setRadius] = useLocalStorage<number>("app_radius", 18);
  const [bubble, setBubble] = useLocalStorage<BubbleStyle>("app_bubble", "rounded");
  const [fontSize, setFontSize] = useLocalStorage<FontSize>("app_font_size", "medium");
  const [blur, setBlur] = useLocalStorage<number>("app_blur", 22);
  const [motion, setMotion] = useLocalStorage<Motion>("app_motion", "normal");
  const [appIcon, setAppIcon] = useLocalStorage<AppIcon>("app_icon", "aurora");

  const [wallpaper, setWallpaper] = useLocalStorage<ChatWallpaperId>("app_wallpaper", DEFAULT_CHAT_WALLPAPER_ID);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [blockedDevices, setBlockedDevices] = useState<BlockedDevice[]>([]);
  const [folders, setFolders] = useState<ChatFolder[]>(DEFAULT_FOLDERS);

  const updateSocial = useCallback((platform: SocialPlatform, url: string | null) => {
    setProfile((prev) => {
      const next = { ...prev.socials };
      if (!url) delete next[platform];
      else next[platform] = url;
      return { ...prev, socials: next };
    });
  }, []);

  const setPref = useCallback(
    <K extends keyof Prefs>(k: K, v: Prefs[K]) => setPrefs((p) => ({ ...p, [k]: v })),
    [],
  );

  const blockDevice = useCallback(
    (d: BlockedDevice) =>
      setBlockedDevices((prev) => (prev.some((x) => x.id === d.id) ? prev : [d, ...prev])),
    [],
  );

  const unblockDevice = useCallback(
    (id: string) => setBlockedDevices((prev) => prev.filter((x) => x.id !== id)),
    [],
  );

  const addFolder = useCallback(
    (f: ChatFolder) =>
      setFolders((prev) => (prev.some((x) => x.id === f.id) ? prev : [...prev, f])),
    [],
  );

  const renameFolder = useCallback(
    (id: string, name: string) =>
      setFolders((prev) => prev.map((x) => (x.id === id ? { ...x, name } : x))),
    [],
  );

  const removeFolder = useCallback(
    (id: string) => setFolders((prev) => prev.filter((x) => x.id !== id)),
    [],
  );

  const reorderFolders = useCallback((from: number, to: number) => {
    setFolders((prev) => {
      const next = [...prev];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme, setTheme,
      accent, setAccent,
      radius, setRadius,
      bubble, setBubble,
      fontSize, setFontSize,
      blur, setBlur,
      motion, setMotion,
      appIcon, setAppIcon,
      wallpaper, setWallpaper,
      profile, setProfile,
      updateSocial,
      prefs, setPref,
      blockedDevices, blockDevice, unblockDevice,
      folders, addFolder, renameFolder, removeFolder, reorderFolders,
    }),
    [
      theme, setTheme, accent, setAccent, radius, setRadius, bubble, setBubble, fontSize, setFontSize, blur, setBlur, motion, setMotion, appIcon, setAppIcon, wallpaper, setWallpaper, profile, setProfile, updateSocial, prefs, setPref, blockedDevices, blockDevice, unblockDevice, folders, addFolder, renameFolder, removeFolder, reorderFolders
    ]
  );

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export function useSettings() {
  const c = useContext(SettingsCtx);
  if (!c) throw new Error("useSettings must be inside SettingsProvider");
  return c;
}

export function extractSocialUsername(platform: SocialPlatform, url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (platform === "youtube" && parts[0] === "channel") return parts[1] || url;
    return parts[parts.length - 1] || url;
  } catch {
    return url;
  }
}

export function isValidSocialUrl(platform: SocialPlatform, url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
