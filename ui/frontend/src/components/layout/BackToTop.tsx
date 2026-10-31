"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import styles from "./BackToTop.module.css";

/** Appears after two screens of scrolling. Moves focus to the top of the page as well as scrolling. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

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
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
    >
      <Icon name="arrowUp" size={20} />
      <span className="visually-hidden">Back to top</span>
    </button>
  );
}
