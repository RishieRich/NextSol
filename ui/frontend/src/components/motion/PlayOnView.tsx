"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { isMotionReady } from "@/lib/useReveal";

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
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
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
  }, []);

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>} className={className} style={style} data-play={play} data-spotlight="">
      {children}
    </Tag>
  );
}
