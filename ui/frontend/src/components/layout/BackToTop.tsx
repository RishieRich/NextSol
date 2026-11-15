"use client";

import { m, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { scrollToTop } from "@/lib/scroll";
import styles from "./BackToTop.module.css";

/**
 * Appears after two screens of scrolling. Moves focus to the top of the page as well as scrolling.
 * A ring around it fills as the visitor reads down the page, so it doubles as "how far am I".
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={styles.button}
      data-visible={visible}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={scrollToTop}
    >
      <svg className={styles.ring} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="24" cy="24" r="22.5" className={styles.track} />
        <m.circle cx="24" cy="24" r="22.5" className={styles.fill} style={{ pathLength: progress }} />
      </svg>
      <Icon name="arrowUp" size={20} className={styles.arrow} />
      <span className="visually-hidden">Back to top</span>
    </button>
  );
}
