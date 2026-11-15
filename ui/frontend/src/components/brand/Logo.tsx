"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type CSSProperties, type MouseEvent } from "react";

import { brandLogo } from "@/content/brand";
import { business } from "@/content/business";
import { motionTokens } from "@/lib/motion";
import { scrollToTop } from "@/lib/scroll";
import styles from "./Logo.module.css";

/** The N-and-chevron mark, used only if the real logo file is ever removed from brand.ts. */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false" className={styles.mark}>
      <rect width="40" height="40" rx="10" className={styles.markTile} />
      <path d="M9 29V11h4.5L20 21.6V11h4.5v18H20l-6.5-10.6V29Z" className={styles.markLetter} />
      <path d="m27.5 14 5 6-5 6" className={styles.markChevron} />
    </svg>
  );
}

type Props = {
  tone?: "default" | "onDark";
  /** Display height in px. The source is 186 px tall: never upscale. */
  height?: number;
  /** Play the power-on sequence on load (header only). */
  intro?: boolean;
};

const ms = (seconds: number) => Math.round(seconds * 1000);
const easeOut = `cubic-bezier(${motionTokens.easeOut.join(", ")})`;

/**
 * Click feedback: the logo presses in, the circuit nodes light up in turn and the sheen sweeps.
 * One-shot Web Animations layered over the CSS ones, so they never restart the intro or the hover replay.
 */
function playBurst(link: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  link.querySelector(`.${styles.frame}`)?.animate(
    [{ transform: "scale(1)" }, { transform: "scale(0.94)", offset: 0.35 }, { transform: "scale(1)" }],
    { duration: ms(motionTokens.dur3), easing: easeOut },
  );
  link.querySelectorAll(`.${styles.node}`).forEach((node, index) => {
    node.animate(
      [
        { opacity: 0, transform: "scale(0.3)" },
        { opacity: 1, transform: "scale(1.6)", offset: 0.45 },
        { opacity: 0, transform: "scale(1)" },
      ],
      { duration: ms(motionTokens.dur4) - 100, delay: index * 60, easing: easeOut },
    );
  });
  link.querySelector(`.${styles.sheen}`)?.animate([{ backgroundPosition: "120% 0" }, { backgroundPosition: "-20% 0" }], {
    duration: ms(motionTokens.dur4),
    delay: 120,
    easing: easeOut,
  });
}

/**
 * Niket's logo, animated with CSS (so the intro costs no JavaScript):
 * on load it rises into view, the eight circuit-tree nodes light up in turn in logo sky-blue,
 * and a light sheen sweeps across the ink. Hovering replays the nodes and the sheen.
 * Light mode shows the transparent logo, dark mode the on-dark variant.
 *
 * Clicking (or tapping) always answers: the logo presses in and lights up. On the home page it then
 * glides back to the top instead of reloading; elsewhere it goes home and the new page starts at the top.
 * Ctrl, Cmd, Shift and middle clicks keep the browser's own behavior (new tab, new window).
 */
export function Logo({ tone = "default", height = 56, intro = false }: Props) {
  const pathname = usePathname();
  const link = useRef<HTMLAnchorElement>(null);
  const className = [styles.logo, tone === "onDark" ? styles.onDark : "", intro ? styles.intro : ""].filter(Boolean).join(" ");

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.current) playBurst(link.current);
    if (pathname !== "/") return;
    event.preventDefault();
    if (window.location.hash) window.history.replaceState(window.history.state, "", "/");
    scrollToTop();
  };

  if (!brandLogo) {
    return (
      <Link ref={link} href="/" className={className} aria-label={`${business.name}, home`} onClick={onClick}>
        <LogoMark />
        <span className={styles.wordmark}>
          <span className={styles.wordNext}>Next</span>
          <span className={styles.wordSolutions}>Solutions</span>
        </span>
      </Link>
    );
  }

  const safeHeight = Math.min(height, brandLogo.height);
  const width = Math.round((brandLogo.width / brandLogo.height) * safeHeight);
  const light = tone === "onDark" ? brandLogo.onDark : brandLogo.transparent;
  const style = { "--logo-mask": `url(${brandLogo.onDark.src})`, width, height: safeHeight } as CSSProperties;

  return (
    <Link ref={link} href="/" className={className} aria-label={`${business.name}, home`} onClick={onClick}>
      <span className={styles.frame} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export serves the file as-is; size is explicit */}
        <img
          src={light.src}
          width={width}
          height={safeHeight}
          alt=""
          className={tone === "default" ? `${styles.img} ${styles.imgLight}` : styles.img}
          fetchPriority={intro ? "high" : "auto"}
          decoding="async"
          draggable={false}
        />
        {/* Both files are in the page and CSS shows the one for the current theme, so the header switch swaps them too. */}
        {tone === "default" ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export serves the file as-is; size is explicit
          <img
            src={brandLogo.onDark.src}
            width={width}
            height={safeHeight}
            alt=""
            className={`${styles.img} ${styles.imgDark}`}
            decoding="async"
            draggable={false}
          />
        ) : null}
        <span className={styles.sheen} aria-hidden="true" />
        <svg className={styles.nodes} viewBox={`0 0 ${brandLogo.width} ${brandLogo.height}`} aria-hidden="true" focusable="false">
          {brandLogo.nodes.map(([cx, cy], index) => (
            <circle key={index} cx={cx} cy={cy} r="3.4" className={styles.node} style={{ "--i": index } as CSSProperties} />
          ))}
        </svg>
      </span>
    </Link>
  );
}
