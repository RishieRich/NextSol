"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
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
 * Pointer parallax (desktop, 12 px max) is the only JavaScript-driven loop. Scrolling away, the board
 * trails the page by up to 64 px and settles back 4%, for depth (off under reduced motion).
 * Pressing the central N sends a surge: light races down every trace to the chips, rings ripple out
 * from the N and each chip bumps as the light arrives. It is one-shot, never a loop.
 * Without JavaScript everything renders in its final state; under reduced motion it is static
 * (a press only lights the traces for a moment).
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

/** How long the traces stay lit after a press; the surge animations finish inside it. */
const SURGE_MS = 1300;

export function HeroNetwork() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  /** Counts presses: each new value remounts the surge layers, which restarts their CSS animations. */
  const [surge, setSurge] = useState(0);
  const surgeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(surgeTimer.current), []);

  const fireSurge = () => {
    setSurge((count) => Math.abs(count) + 1);
    window.clearTimeout(surgeTimer.current);
    surgeTimer.current = window.setTimeout(() => setSurge((count) => -Math.abs(count)), SURGE_MS);
  };
  const surging = surge > 0;

  // Scroll depth: the hero sits at the top of the page, so page scroll is its own progress.
  const still = Boolean(useReducedMotion());
  const { scrollY } = useScroll();
  const depthY = useTransform(scrollY, [0, 800], [0, 64], { clamp: true });
  const depthScale = useTransform(scrollY, [0, 800], [1, 0.96], { clamp: true });

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
    <m.div
      ref={root}
      className={styles.network}
      style={still ? undefined : { y: depthY, scale: depthScale }}
      data-loop=""
      data-active={active ?? undefined}
      data-surging={surging || undefined}
    >
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
        {surging ? (
          <g key={surge} className={styles.surge}>
            {[...TRACES, ...BRANCHES].map((d, i) => (
              <path key={d} d={d} pathLength={1} className={styles.surgeTrace} style={{ "--i": i } as CSSProperties} />
            ))}
          </g>
        ) : null}
      </svg>

      <button type="button" className={styles.core} onClick={fireSurge} aria-label="Light up the network">
        <span className={styles.coreRing} aria-hidden="true" />
        {surging ? (
          <span key={surge} className={styles.ripples} aria-hidden="true">
            <span className={styles.ripple} />
            <span className={styles.ripple} />
          </span>
        ) : null}
        {brandLogo ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export serves the file as-is; size is explicit
          <img
            src={brandLogo.mark.src}
            width={brandLogo.mark.width}
            height={brandLogo.mark.height}
            alt=""
            className={styles.coreMark}
            draggable={false}
          />
        ) : null}
        <span className={styles.coreHint} aria-hidden="true">
          Light it up
        </span>
      </button>

      <ul className={styles.chips}>
        {heroChips.map((chip, i) => {
          const [x, y] = CHIP_POS[i] ?? [VIEW.w / 2, VIEW.h / 2];
          return (
            <li
              key={chip.href}
              className={styles.chipItem}
              data-surge={surging ? surge % 2 : undefined}
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
    </m.div>
  );
}
