"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { Emoji } from "@/components/ui/Emoji";
import { brandLogo } from "@/content/brand";
import { heroChips } from "@/content/home";
import styles from "./HeroNetwork.module.css";

/**
 * The hero's circuit network, grown from the tree on top of Niket's logo.
 * Geometry lives in a 600 x 540 box. Traces run from the central "N" chip out to six product chips.
 *
 * Load (CSS only, so it starts at first paint and needs no JavaScript): traces draw in as a cascade
 * (about 1.2 s), then the chips pop in. Afterwards, sky-blue pulses run along the traces every 3 to 5 s
 * and the chips float. Hover or focus lifts a chip, lights its trace and shows its name.
 * Pointer parallax (desktop, 12 px max) is the only JavaScript-driven part.
 * Without JavaScript everything renders in its final state; under reduced motion it is static.
 */

const VIEW = { w: 600, h: 540 };

/** Chip centres, in the same order as heroChips. */
const CHIP_POS: readonly [number, number][] = [
  [118, 132],
  [300, 70],
  [482, 132],
  [530, 332],
  [470, 482],
  [118, 470],
];

/** Each trace leaves the central chip (x 234 to 366, y 266 to 398) and ends at its chip's edge. */
const TRACES = [
  "M258 266 V206 L190 138 H164",
  "M300 266 V118",
  "M342 266 V206 L410 138 H436",
  "M366 312 H412 L432 332 H484",
  "M342 398 V424 L396 478 H424",
  "M258 398 V424 L212 470 H164",
];

/** Short decorative branches with end nodes, like the logo's tree. */
const BRANCHES = ["M280 266 V238 L266 224", "M320 266 V232 L336 216", "M234 300 H214 L204 290", "M366 368 H384 L394 378"];
const BRANCH_NODES: readonly [number, number][] = [
  [266, 224],
  [336, 216],
  [204, 290],
  [394, 378],
];

const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(3)}%`;

export function HeroNetwork() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // Pointer parallax: only with a fine pointer, motion allowed and the hero on screen.
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches || document.documentElement.classList.contains("save-data")) return;

    let frame = 0;
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
    });
    io.observe(node);

    const onMove = (event: PointerEvent) => {
      if (!onScreen || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        node.style.setProperty("--px", x.toFixed(3));
        node.style.setProperty("--py", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={root} className={styles.network} data-loop="" data-active={active ?? undefined}>
      <div className={styles.glow} aria-hidden="true" />

      <svg className={styles.svg} viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} aria-hidden="true" focusable="false">
        <g className={styles.grid}>
          {Array.from({ length: 11 }, (_, i) => (
            <circle key={i} cx={60 + i * 48} cy={270} r={1.2} />
          ))}
        </g>
        {BRANCHES.map((d, i) => (
          <path key={d} d={d} pathLength={1} className={`${styles.trace} ${styles.branch}`} style={{ "--i": i + 6 } as CSSProperties} />
        ))}
        {BRANCH_NODES.map(([cx, cy], i) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={4.5} className={styles.node} style={{ "--i": i + 6 } as CSSProperties} />
        ))}
        {TRACES.map((d, i) => (
          <g key={d} data-index={i} className={styles.traceGroup}>
            <path d={d} pathLength={1} className={styles.trace} style={{ "--i": i } as CSSProperties} />
            <path
              d={d}
              pathLength={1}
              className={styles.pulse}
              style={{ "--i": i, "--pulse-dur": `${3 + ((i * 7) % 5) * 0.5}s` } as CSSProperties}
            />
          </g>
        ))}
      </svg>

      <div className={styles.core} aria-hidden="true">
        <span className={styles.coreRing} />
        {brandLogo ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export serves the file as-is; size is explicit
          <img src={brandLogo.mark.src} width={brandLogo.mark.width} height={brandLogo.mark.height} alt="" className={styles.coreMark} />
        ) : null}
      </div>

      <ul className={styles.chips}>
        {heroChips.map((chip, i) => {
          const [x, y] = CHIP_POS[i] ?? [VIEW.w / 2, VIEW.h / 2];
          return (
            <li
              key={chip.href}
              className={styles.chipItem}
              style={{ left: pct(x, VIEW.w), top: pct(y, VIEW.h), "--i": i, "--depth": 0.6 + (i % 3) * 0.25 } as CSSProperties}
            >
              <Link
                href={chip.href}
                className={styles.chip}
                data-index={i}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <span className={styles.chipFace}>
                  <Emoji name={chip.emoji} size={64} float eager fluid shadow={false} className={styles.chipEmoji} />
                </span>
                <span className={styles.chipLabel}>{chip.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
