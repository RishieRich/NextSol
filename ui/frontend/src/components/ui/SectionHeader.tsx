import type { ReactNode } from "react";

import { WordReveal } from "@/components/motion/WordReveal";
import styles from "./SectionHeader.module.css";

type Props = {
  id: string;
  title: string;
  /** Niket's `// label //` device above the title. Decorative: the h2 carries the meaning. */
  label?: string;
  intro?: ReactNode;
  tone?: "default" | "onDark";
  align?: "start" | "center";
  /** His blue full stop at the end of the title. */
  dot?: boolean;
  aside?: ReactNode;
};

/** The heading block every section opens with. The title reveals word by word; the real text stays in the h2. */
export function SectionHeader({ id, title, label, intro, tone = "default", align = "start", dot = false, aside }: Props) {
  const className = [styles.header, tone === "onDark" ? styles.onDark : "", align === "center" ? styles.center : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <div className={styles.text}>
        {label ? (
          <p className={styles.label} aria-hidden="true">
            {"// "}
            {label}
            {" //"}
          </p>
        ) : null}
        <h2 id={id} className={styles.title}>
          <WordReveal text={title} dot={dot} dotClassName="ns-dot" />
        </h2>
        {intro ? <p className={styles.intro}>{intro}</p> : null}
      </div>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </div>
  );
}
