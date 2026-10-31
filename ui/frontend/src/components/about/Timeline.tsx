import { Cascade, CascadeItem } from "@/components/motion/Reveal";
import { Emoji } from "@/components/ui/Emoji";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { timeline, values } from "@/content/about";
import styles from "./Timeline.module.css";

/** The about page's timeline (only real milestones) and Niket's three values. */
export function Timeline() {
  return (
    <>
      <section className={styles.section} aria-labelledby="timeline-title">
        <div className="container">
          <SectionHeader id="timeline-title" label="our story" title="From 2015 to today" dot />
          <Cascade as="ol" className={styles.timeline}>
            {timeline.map((step) => (
              <CascadeItem key={step.title} className={styles.step}>
                <span className={styles.marker} aria-hidden="true">
                  <Emoji name={step.emoji} size={36} shadow={false} />
                </span>
                <p className={styles.when}>{step.when}</p>
                <h3>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
              </CascadeItem>
            ))}
          </Cascade>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="values-title">
        <div className="container">
          <SectionHeader id="values-title" label="values" title="What we stand by" dot align="center" />
          <Cascade className={styles.values}>
            {values.map((value) => (
              <CascadeItem key={value.title} className={`fx-card ${styles.value}`} spotlight>
                <Emoji name={value.emoji} size={64} />
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </CascadeItem>
            ))}
          </Cascade>
        </div>
      </section>
    </>
  );
}
