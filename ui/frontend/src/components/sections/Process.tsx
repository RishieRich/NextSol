"use client";

import { m, useReducedMotion, useScroll, useTransform, type MotionStyle } from "motion/react";
import { useRef } from "react";

import { Cascade, CascadeItem } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { processSteps } from "@/content/services";
import styles from "./Process.module.css";

/**
 * The four steps of a custom job. The line joining the step numbers draws with the scroll
 * (a CSS variable read only under .motion-ready, so it is complete without JavaScript and under reduced motion).
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className={styles.section} aria-labelledby="process-title">
      <div className="container">
        <SectionHeader
          id="process-title"
          label="how we work"
          title="How a custom job runs"
          intro="Whether it is a Tally report or a new website, every job follows the same four steps."
          dot
        />
        <div ref={ref} className={styles.wrap}>
          <m.span className={styles.line} aria-hidden="true" style={reduce ? undefined : ({ "--line": line } as unknown as MotionStyle)} />
          <Cascade as="ol" className={styles.steps}>
            {processSteps.map((step, index) => (
              <CascadeItem key={step.title} className={styles.step}>
                <span className={styles.number} aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </CascadeItem>
            ))}
          </Cascade>
        </div>
      </div>
    </section>
  );
}
