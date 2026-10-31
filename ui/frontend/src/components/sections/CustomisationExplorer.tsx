"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/content/business";
import { customisations } from "@/content/tally";
import { whatsappUrl } from "@/domain/enquiry";
import { CustomisationPreview } from "./CustomisationPreviews";
import styles from "./CustomisationExplorer.module.css";

/** Tabs follow the WAI-ARIA tabs pattern: arrow keys move between them, the panel follows. */
export function CustomisationExplorer() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = customisations[active] ?? customisations[0]!;

  const select = (index: number) => {
    const next = (index + customisations.length) % customisations.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: customisations.length - 1,
    };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target);
  };

  const enquiry = whatsappUrl(
    business.whatsappE164,
    `Hello Next Solutions, I'd like to discuss a Tally customisation: ${current.tab}.`,
  );

  return (
    <section className={styles.section} aria-labelledby="custom-title">
      <div className="container">
        <SectionHeader
          id="custom-title"
          title="See what a customisation changes"
          intro="Five of the changes we build most often. Pick one to see it on sample data."
        />

        <div className={styles.layout}>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Customisations"
            aria-orientation="vertical"
            style={{ "--index": active, "--count": customisations.length } as CSSProperties}
          >
            <span className={styles.indicator} aria-hidden="true" />
            {customisations.map((item, index) => (
              <button
                key={item.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-controls="custom-panel"
                tabIndex={index === active ? 0 : -1}
                className={styles.tab}
                onClick={() => setActive(index)}
                onKeyDown={onKeyDown}
              >
                {item.tab}
              </button>
            ))}
          </div>

          <div id="custom-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`} className={styles.panel}>
            <div key={current.id} className={styles.panelInner}>
              <div className={styles.copy}>
                <h3>{current.title}</h3>
                <dl className={styles.beforeAfter}>
                  <div>
                    <dt>Today</dt>
                    <dd>{current.problem}</dd>
                  </div>
                  <div>
                    <dt>After</dt>
                    <dd>{current.outcome}</dd>
                  </div>
                </dl>
                <ButtonLink href={enquiry} variant="secondary" icon="chat">
                  Ask about this on WhatsApp
                </ButtonLink>
              </div>
              <div className={styles.preview}>
                <CustomisationPreview id={current.id} />
                <p className={styles.sample}>Sample data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
