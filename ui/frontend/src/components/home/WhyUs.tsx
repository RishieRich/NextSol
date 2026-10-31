import { Cascade, CascadeItem } from "@/components/motion/Reveal";
import { StatRing } from "@/components/motion/StatRing";
import { Emoji } from "@/components/ui/Emoji";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/content/business";
import { whyUs } from "@/content/home";
import { clientCountClaim, reviews } from "@/content/proof";
import { yearsClaim } from "@/domain/format";
import styles from "./WhyUs.module.css";

/** "Why Next Solutions": a number band on ink, then three reasons drawn from real material. */
export function WhyUs() {
  const quote = reviews[0];

  return (
    <section className={styles.section} aria-labelledby="why-title">
      <div className="container">
        <div className={styles.band}>
          <SectionHeader id="why-title" label="why us" title="Why Next Solutions" tone="onDark" dot />
          <ul className={styles.numbers}>
            <li>
              <StatRing tone="onDark" value={yearsClaim(business.foundedYear)} suffix="+" label={`years in ${business.address.city}, since ${business.foundedYear}`} />
            </li>
            <li>
              <StatRing tone="onDark" value={clientCountClaim.value} suffix={clientCountClaim.suffix} label={`${clientCountClaim.label} served`} />
            </li>
          </ul>

          <Cascade className={styles.reasons}>
            {whyUs.map((reason) => (
              <CascadeItem key={reason.title} className={styles.reason}>
                <Emoji name={reason.emoji} size={56} />
                <h3>{reason.title}</h3>
                <p>{reason.body}</p>
                {reason.withReview && quote ? (
                  <figure className={styles.quote}>
                    <blockquote>
                      <p>&ldquo;{quote.quote}&rdquo;</p>
                    </blockquote>
                    <figcaption>{quote.attribution}</figcaption>
                  </figure>
                ) : null}
              </CascadeItem>
            ))}
          </Cascade>
        </div>
      </div>
    </section>
  );
}
