import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { tallyFaqs } from "@/content/tally";
import styles from "./TallyFaq.module.css";

/** Native details/summary: works without JavaScript, keyboard accessible by default. */
export function TallyFaq() {
  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={`container ${styles.layout}`}>
        <SectionHeader
          id="faq-title"
          title="Questions we hear every week"
          intro="Straight answers on editions, renewals, rentals and cloud access."
        />
        <div className={styles.list}>
          {tallyFaqs.map((faq, index) => (
            <details key={faq.question} className={styles.item} name="tally-faq" open={index === 0}>
              <summary className={styles.summary}>
                <span>{faq.question}</span>
                <Icon name="chevronDown" className={styles.chevron} />
              </summary>
              <div className={styles.answer}>
                <p>{faq.answer}</p>
                {faq.source ? (
                  <p className={styles.source}>
                    Source:{" "}
                    <a href={faq.source.url} target="_blank" rel="noopener noreferrer">
                      {faq.source.label}, {faq.source.asOf}
                    </a>
                  </p>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
