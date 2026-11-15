"use client";

import { m } from "motion/react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { panelReveal } from "@/lib/motion";
import { isMotionReady, useReveal } from "@/lib/useReveal";

/**
 * Sets data-play="true" the first time the element is on screen, so CSS can play a one-off demo
 * (written as `.motion-ready [data-play] ...`). Only decorative parts start hidden; text never does.
 * Without JavaScript the page is not motion-ready and CSS shows every demo in its finished state.
 */
export function PlayOnView({
  children,
  className,
  style,
  as: Tag = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "article" | "li";
  delay?: number;
}) {
  const { ref, state } = useReveal<HTMLElement>(0.2);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !isMotionReady()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  const Component = m[Tag] as typeof m.div;

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={style}
      variants={panelReveal}
      custom={delay}
      initial={false}
      animate={state}
      data-play={play}
      data-spotlight=""
    >
      {children}
    </Component>
  );
}
