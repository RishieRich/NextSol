"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { motionTokens } from "@/lib/motion";
import { isMotionReady } from "@/lib/useReveal";
import styles from "./StatRing.module.css";

const subscribeNever = () => () => {};

/** Ease-out close to the site's --ns-ease-out curve. */
const easeOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * A ring that draws in while its number counts up (1.2 s), the first time it is on screen.
 * Server HTML has the final number and a full ring, so without JavaScript the stat is complete.
 * Under motion-ready, CSS hides the number until this component arms it (with a 2.5 s fallback).
 */
export function StatRing({
  value,
  suffix = "",
  label,
  children,
  tone = "default",
}: {
  /** Omit for a badge (ring only, with `children` in the middle). */
  value?: number;
  suffix?: string;
  label: string;
  children?: ReactNode;
  tone?: "default" | "onDark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // False in the server HTML and during hydration, true afterwards: no setState needed to "arm".
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const animated = hydrated && !reduce && isMotionReady();
  const [t, setT] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || !animated) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = Math.min(1, (now - start) / (motionTokens.count * 1000));
          setT(elapsed);
          if (elapsed < 1) frame = window.requestAnimationFrame(tick);
        };
        frame = window.requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [animated]);

  const progress = animated ? easeOut(t) : 1;
  const armed = hydrated;
  const shown = value === undefined ? null : Math.round(value * progress);

  return (
    <div ref={ref} className={[styles.stat, tone === "onDark" ? styles.onDark : ""].join(" ")} data-armed={armed}>
      <div className={styles.ring} aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" className={styles.track} />
          <circle cx="50" cy="50" r="44" pathLength={1} className={styles.arc} style={{ strokeDashoffset: 1 - progress }} />
        </svg>
        <span className={styles.center}>
          {shown !== null ? (
            <span className={`tabular ${styles.number}`} data-long={`${value}${suffix}`.length > 3 || undefined}>
              {shown}
              {suffix}
            </span>
          ) : (
            children
          )}
        </span>
      </div>
      <p className={styles.label}>
        {value !== undefined ? (
          <span className="visually-hidden">
            {value}
            {suffix}{" "}
          </span>
        ) : null}
        {label}
      </p>
    </div>
  );
}
