"use client";

import { useEffect, useRef, useState } from "react";

import { useDecorativeMotion, useOnScreen, usePageVisible } from "@/lib/useReveal";
import styles from "./Ticker.module.css";

const STEP_MS = 2200;

/**
 * "We do ___" with a vertical slot-machine roll through the services.
 * Screen readers get the whole list once; the rolling copy is aria-hidden.
 * Rolls only while on screen and the tab is visible; static under reduced motion and Save-Data.
 */
export function Ticker({ lead, items }: { lead: string; items: readonly string[] }) {
  const { ref, onScreen } = useOnScreen<HTMLSpanElement>();
  const visible = usePageVisible();
  const motionOk = useDecorativeMotion();
  const [index, setIndex] = useState(0);
  const [snap, setSnap] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const running = motionOk && onScreen && visible;

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => setIndex((i) => i + 1), STEP_MS);
    return () => window.clearInterval(timer.current);
  }, [running]);

  // After rolling onto the copy of the first item, jump back to the real first item without a transition.
  const onTransitionEnd = () => {
    if (index >= items.length) {
      setSnap(true);
      setIndex(0);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => setSnap(false)));
    }
  };

  return (
    <p className={styles.ticker}>
      <span className={styles.lead}>{lead}</span>{" "}
      <span className="visually-hidden">{items.join(", ")}</span>
      <span ref={ref} className={styles.window} aria-hidden="true">
        <span
          className={styles.reel}
          data-snap={snap}
          style={{ transform: `translateY(${-index * 1.5}em)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {[...items, items[0]].map((item, i) => (
            <span key={`${item}-${i}`} className={styles.item}>
              {item}
            </span>
          ))}
        </span>
      </span>
    </p>
  );
}
