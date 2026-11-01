/**
 * Light and dark mode. The visitor's system setting decides by default; the header switch stores an
 * explicit choice in localStorage and writes it to `data-theme` on <html>, which theme.css honours.
 * A pre-paint inline script applies the stored choice, so a reload never flashes the wrong theme.
 */

import { browserThemeColor } from "@/styles/theme";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ns-theme";
const THEME_EVENT = "ns-themechange";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";

/** Runs in <head> before first paint. Arguments are passed in, because the function is serialised. */
export function applyStoredTheme(key: string): void {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === "light" || stored === "dark") document.documentElement.dataset.theme = stored;
  } catch {
    // Storage blocked (private mode, site data off): follow the system setting.
  }
}

/** The same function as an inline script for layout.tsx. */
export const THEME_SCRIPT = `(${applyStoredTheme.toString()})(${JSON.stringify(THEME_STORAGE_KEY)})`;

/** The theme on screen now: the explicit choice if there is one, otherwise the system setting. */
export function readTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (isTheme(chosen)) return chosen;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/** Keep the browser's address-bar color in step with an explicit choice (the meta tags only know the system setting). */
export function syncThemeColor(): void {
  const chosen = document.documentElement.dataset.theme;
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    const systemDark = meta.media.includes("dark");
    const theme: Theme = isTheme(chosen) ? chosen : systemDark ? "dark" : "light";
    meta.content = browserThemeColor[theme];
  }
}

function writeTheme(theme: Theme): void {
  const root = document.documentElement;
  // Switch every color at once: without this, each component's own color transition runs at its own speed.
  root.classList.add("theme-switching");
  root.dataset.theme = theme;
  syncThemeColor();
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => root.classList.remove("theme-switching")));
  window.dispatchEvent(new Event(THEME_EVENT));
}

/** Apply and remember a theme. Cross-fades where the browser supports view transitions, unless motion is reduced. */
export function setTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && typeof document.startViewTransition === "function") {
    document.startViewTransition(() => writeTheme(theme));
  } else {
    writeTheme(theme);
  }
}

/** For useSyncExternalStore: the switch, a system change, or a choice made in another tab. */
export function subscribeTheme(onChange: () => void): () => void {
  const media = window.matchMedia(DARK_QUERY);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    if (isTheme(event.newValue)) document.documentElement.dataset.theme = event.newValue;
    else delete document.documentElement.dataset.theme;
    syncThemeColor();
    onChange();
  };
  media.addEventListener("change", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}
