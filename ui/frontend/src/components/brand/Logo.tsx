import Link from "next/link";
import type { CSSProperties } from "react";

import { brandLogo } from "@/content/brand";
import { business } from "@/content/business";
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

/**
 * Niket's logo, animated with CSS only (so it costs no JavaScript):
 * on load it rises into view, the eight circuit-tree nodes light up in turn in logo sky-blue,
 * and a light sheen sweeps across the ink. Hovering replays the nodes and the sheen.
 * Light mode shows the transparent logo, dark mode the on-dark variant.
 */
export function Logo({ tone = "default", height = 56, intro = false }: Props) {
  const className = [styles.logo, tone === "onDark" ? styles.onDark : "", intro ? styles.intro : ""].filter(Boolean).join(" ");

  if (!brandLogo) {
    return (
      <Link href="/" className={className} aria-label={`${business.name}, home`}>
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
    <Link href="/" className={className} aria-label={`${business.name}, home`}>
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
