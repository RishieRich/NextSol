import type { ReactNode } from "react";

import styles from "./PageIntro.module.css";

/** The opening block of every inner page: the page's one h1 (with the blue full stop) and a short lede. */
export function PageIntro({ title, lede, children }: { title: string; lede: string; children?: ReactNode }) {
  return (
    <section className={styles.intro} aria-labelledby="page-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <h1 id="page-title" className={styles.title}>
          {title}
          <span className="ns-dot">.</span>
        </h1>
        <p className={`lede ${styles.lede}`}>{lede}</p>
        {children ? <div className={styles.extra}>{children}</div> : null}
      </div>
    </section>
  );
}
