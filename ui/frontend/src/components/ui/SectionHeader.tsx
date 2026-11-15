import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { motionTokens } from "@/lib/motion";
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
          <Reveal as="p" className={styles.label} aria-hidden={true}>
            {"// "}
            {label}
            {" //"}
          </Reveal>
        ) : null}
        <h2 id={id} className={styles.title}>
          <WordReveal text={title} dot={dot} dotClassName="ns-dot" />
        </h2>
        {intro ? (
          <Reveal as="p" className={styles.intro} delay={motionTokens.stagger}>
            {intro}
          </Reveal>
        ) : null}
      </div>
      {aside ? (
        <Reveal className={styles.aside} delay={motionTokens.stagger * 2}>
          {aside}
        </Reveal>
      ) : null}
    </div>
  );
}
