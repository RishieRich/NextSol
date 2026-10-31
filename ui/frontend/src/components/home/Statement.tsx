"use client";

import { m, useReducedMotion, useScroll, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

import { Emoji } from "@/components/ui/Emoji";
import { statement } from "@/content/home";
import styles from "./Statement.module.css";

type Piece = (typeof statement)[number];

/** Split plain strings into words; keep each pill whole. */
type Split = { key: string; piece: string | Exclude<Piece, string> };
const pieces: Split[] = statement.flatMap((piece, i): Split[] =>
  typeof piece === "string" ? piece.split(" ").map((word, j) => ({ key: `${i}-${j}`, piece: word })) : [{ key: `${i}`, piece }],
);

function Word({ progress, index, still, children }: { progress: MotionValue<number>; index: number; still: boolean; children: React.ReactNode }) {
  const start = index / pieces.length;
  const end = start + 1.5 / pieces.length;
  const opacity = useTransform(progress, [start, end], [0.25, 1]);
  return (
    // A CSS variable, applied only under .motion-ready: without JavaScript the words stay fully opaque.
    <m.span className={styles.piece} style={still ? undefined : ({ "--o": opacity } as unknown as MotionStyle)}>
      {children}
    </m.span>
  );
}

/**
 * His `// services //` sentence as a scroll-linked reveal: words brighten from 25% to 100% opacity
 * as the section scrolls through the viewport. Server HTML is fully opaque (the motion value only
 * takes over after hydration); under reduced motion it stays fully opaque. The words are the real text.
 */
export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const still = Boolean(useReducedMotion());

  return (
    <section className={styles.section} aria-labelledby="statement-label">
      <div className="container">
        <h2 id="statement-label" className={styles.label}>
          <span aria-hidden="true">{"// "}</span>Services<span aria-hidden="true">{" //"}</span>
        </h2>
        <div ref={ref} className={styles.text}>
          <p className={styles.visual}>
            {pieces.map(({ key, piece }, index) => (
              <Word key={key} progress={scrollYProgress} index={index} still={still}>
                {typeof piece === "string" ? (
                  piece
                ) : (
                  <Link href={piece.href} className={styles.pill}>
                    <Emoji name={piece.emoji} size={40} fluid shadow={false} className={styles.pillEmoji} />
                    {piece.text}
                  </Link>
                )}
              </Word>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
