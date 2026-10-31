"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

import { applyMotionReady } from "@/lib/motionReady";

/**
 * Site-wide motion housekeeping, mounted once in the layout:
 * - re-applies the `motion-ready` / `save-data` classes (dev Strict Mode clears <html> attributes on remount);
 * - pauses every decorative loop ([data-loop]) while it is off-screen or the tab is hidden,
 *   by toggling data-playing; CSS pauses anything without data-playing="true".
 */
export function LoopController() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    // Same function as the inline head script; a no-op in production where the script already ran.
    applyMotionReady();
  }, []);

  useEffect(() => {
    const visible = new Set<Element>();
    const update = (element: Element) => {
      const playing = visible.has(element) && document.visibilityState === "visible";
      element.setAttribute("data-playing", String(playing));
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
        update(entry.target);
      }
    });
    const scan = () => document.querySelectorAll("[data-loop]").forEach((element) => observer.observe(element));
    // Pages mount after the layout effect on navigation; scan on the next frame too.
    scan();
    const frame = window.requestAnimationFrame(scan);
    const onVisibility = () => document.querySelectorAll("[data-loop]").forEach(update);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname]);

  return null;
}
