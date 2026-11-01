"use client";

import { useEffect, useSyncExternalStore } from "react";

import { Icon } from "@/components/ui/Icon";
import { readTheme, setTheme, subscribeTheme, syncThemeColor, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

const serverTheme = (): Theme | null => null;

/**
 * Light / dark switch. The icon is chosen by CSS from the theme on <html>, so it is right on first paint;
 * the pressed state and tooltip follow once the page has hydrated.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  const dark = theme === "dark";

  useEffect(() => {
    syncThemeColor();
  }, []);

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(" ")}
      aria-pressed={theme === null ? undefined : dark}
      title={theme === null ? undefined : dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(readTheme() === "dark" ? "light" : "dark")}
    >
      <Icon name="moon" size={20} className={styles.moon} />
      <Icon name="sun" size={20} className={styles.sun} />
      <span className="visually-hidden">Dark mode</span>
    </button>
  );
}
