"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type RevealState = "hidden" | "show";

/** True when the visitor's browser has opted into motion: JS ran (motion-ready) and no reduced motion. */
export function isMotionReady(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains("motion-ready");
}

/** True when decorative loops (float, pulses, autoplay) may run: motion allowed and Save-Data off. */
export function useDecorativeMotion(): boolean {
  const reduce = useReducedMotion();
  const [saveData, setSaveData] = useState(false);
  useEffect(() => {
    // Read once after mount; the class is set before first paint by the inline script in layout.tsx.
    const id = window.requestAnimationFrame(() => setSaveData(document.documentElement.classList.contains("save-data")));
    return () => window.cancelAnimationFrame(id);
  }, []);
  return !reduce && !saveData;
}

/**
 * Reveal-once on scroll, without ever hiding content that is already on screen.
 * Server HTML and the first client render are "show" (so no-JS, crawlers and above-the-fold content
 * are untouched). After mount, an element that is still off-screen is set to "hidden" instantly,
 * then revealed the first time it scrolls into view.
 */
export function useReveal<T extends Element>(amount = 0.15) {
  const ref = useRef<T | null>(null);
  const reduce = useReducedMotion();
  const [state, setState] = useState<RevealState>("show");

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce || !isMotionReady()) return;
    let first = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        if (first) {
          first = false;
          if (entry.isIntersecting) {
            observer.disconnect();
            return;
          }
          setState("hidden");
          return;
        }
        if (entry.isIntersecting) {
          setState("show");
          observer.disconnect();
        }
      },
      { threshold: [0, amount], rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce, amount]);

  return { ref, state };
}

/** True while an element is on screen; used to pause loops off-screen. */
export function useOnScreen<T extends Element>(rootMargin = "0px") {
  const ref = useRef<T | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => setOnScreen(entries.some((e) => e.isIntersecting)), { rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);
  return { ref, onScreen };
}

/** True while the tab is visible. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}
