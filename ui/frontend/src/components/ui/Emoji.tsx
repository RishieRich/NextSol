import Image from "next/image";
import type { CSSProperties } from "react";

import { emojiSrc, type EmojiKey } from "@/content/emoji";
import styles from "./Emoji.module.css";

type Props = {
  name: EmojiKey;
  size?: number;
  /** Gentle float (6 px, 4 to 6 s, each emoji at its own phase). Off under reduced motion and Save-Data. */
  float?: boolean;
  /** Soft blurred floor shadow under the emoji. */
  shadow?: boolean;
  /** Above the fold: load eagerly. */
  eager?: boolean;
  /** The size is set in CSS by `className` (as --size), e.g. in container units. `size` still sets the intrinsic size. */
  fluid?: boolean;
  className?: string;
};

/** Stable per-emoji phase and duration, so floating emoji never move in step. */
function phase(name: string): CSSProperties {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return { "--float-delay": `-${(hash % 50) / 10}s`, "--float-dur": `${4 + (hash % 21) / 10}s` } as CSSProperties;
}

/**
 * A 3D Fluent emoji. Decorative: the text next to it always carries the meaning,
 * so the image has alt="" and aria-hidden. Width and height are explicit, so nothing shifts.
 */
export function Emoji({ name, size = 48, float = false, shadow = true, eager = false, fluid = false, className }: Props) {
  return (
    <span
      className={[styles.emoji, float ? styles.float : "", className].filter(Boolean).join(" ")}
      style={{ ...(fluid ? {} : { "--size": `${size}px` }), ...phase(name) } as CSSProperties}
      aria-hidden="true"
    >
      <Image
        src={emojiSrc(name)}
        alt=""
        width={size}
        height={size}
        className={styles.img}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
      />
      {shadow ? <span className={styles.shadow} /> : null}
    </span>
  );
}
