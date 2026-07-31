// Native device feedback helpers — real APIs, no simulated sounds.

let audioCtx: AudioContext | null = null;

/**
 * Play the operating system's default notification sound.
 * Strategy: request Notification permission and fire a silent-body
 * notification — the OS plays its own default sound and (on mobile)
 * vibrates per system settings. Falls back to a short Web Audio ping
 * when notifications aren't available (e.g. permission denied, insecure
 * context, or unsupported browser) so the toggle always has audible feedback.
 */
export async function playNotificationSound(): Promise<void> {
  try {
    if (typeof window !== "undefined" && "Notification" in window) {
      let perm = Notification.permission;
      if (perm === "default") {
        perm = await Notification.requestPermission();
      }
      if (perm === "granted") {
        const n = new Notification("Sound on", {
          body: "Notification sound preview",
          silent: false,
          tag: "sound-preview",
        });
        setTimeout(() => n.close(), 1200);
        return;
      }
    }
  } catch {
    /* fall through to Web Audio */
  }
  webAudioPing();
}

function webAudioPing() {
  try {
    const AC =
      (
        window as unknown as {
          AudioContext?: typeof AudioContext;
          webkitAudioContext?: typeof AudioContext;
        }
      ).AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    audioCtx ??= new AC();
    const ctx = audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.34);
  } catch {
    /* noop */
  }
}

/**
 * Trigger the phone's vibration motor via the native Vibration API.
 * Respects OS-level system vibration/silent settings automatically.
 */
export function vibrateDevice(pattern: number | number[] = [40, 30, 60]): boolean {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      return navigator.vibrate(pattern);
    }
  } catch {
    /* noop */
  }
  return false;
}
