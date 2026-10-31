/**
 * Shared motion values and variants. Components use these, never ad-hoc numbers.
 * The numbers mirror the motion tokens in styles/theme.css (Motion needs them in JS); keep both equal.
 *
 * Rules (ADR-0002): animate only transform, opacity, filter, clip-path and pathLength.
 * Hidden starting states apply only after the inline script in layout.tsx adds `motion-ready` to <html>,
 * so without JavaScript every element renders in its final state.
 */

import type { Transition, Variants } from "motion/react";

export const motionTokens = {
  dur1: 0.16,
  dur2: 0.28,
  dur3: 0.52,
  dur4: 0.9,
  draw: 1.2,
  count: 1.2,
  stagger: 0.075,
  staggerWord: 0.04,
  revealY: 20,
  floatY: 6,
  ease: [0.2, 0.7, 0.2, 1] as [number, number, number, number],
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const;

const { dur3, dur4, stagger, staggerWord, revealY, easeOut } = motionTokens;

/** Going back to a hidden state is always instant: it only happens off-screen, before a reveal. */
const instant: Transition = { duration: 0 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: revealY, transition: instant },
  show: { opacity: 1, y: 0, transition: { duration: dur3, ease: easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, transition: instant },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 380, damping: 22 } },
};

export const cascade: { container: Variants; item: Variants } = {
  container: {
    hidden: { transition: instant },
    show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
  },
  item: fadeUp,
};

/** SVG traces drawing in; `custom` is the trace's index in the cascade. */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0, transition: instant },
  show: (index: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: dur4, ease: easeOut, delay: index * stagger }, opacity: { duration: 0.01, delay: index * stagger } },
  }),
};

export const wordReveal: { container: Variants; word: Variants } = {
  container: {
    hidden: { transition: instant },
    show: { transition: { staggerChildren: staggerWord } },
  },
  word: {
    hidden: { opacity: 0, y: "0.45em", filter: "blur(4px)", transition: instant },
    show: { opacity: 1, y: "0em", filter: "blur(0px)", transition: { duration: dur3, ease: easeOut } },
  },
};
