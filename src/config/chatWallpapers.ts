export type ChatWallpaperId = string;

export interface ChatWallpaper {
  id: ChatWallpaperId;
  name: string;
  url: string;
  thumbnail: string;
  category: "abstract" | "nature" | "minimal" | "other";
}

const wallpaperModules = import.meta.glob('../assets/images/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const wallpapersArray: ChatWallpaper[] = Object.entries(wallpaperModules || {}).map(([path, url], i) => {
  const match = path.match(/\/([^/]+)\.[a-z0-9]+$/i);
  const filename = match ? match[1] : `Wallpaper ${i + 1}`;
  const name = filename
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    id: filename,
    name,
    url,
    thumbnail: url,
    category: "other"
  };
});

export const CHAT_WALLPAPERS: Record<ChatWallpaperId, ChatWallpaper> = {
  none: {
    id: "none",
    name: "None",
    url: "none",
    thumbnail: "none",
    category: "minimal"
  },
  ...Object.fromEntries(wallpapersArray.map(w => [w.id, w]))
};

export const DEFAULT_CHAT_WALLPAPER_ID: ChatWallpaperId = "none";
