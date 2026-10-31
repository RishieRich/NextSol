import { Fragment, type CSSProperties } from "react";

import { HeroNetwork } from "@/components/home/HeroNetwork";
import { Ticker } from "@/components/home/Ticker";
import { StatRing } from "@/components/motion/StatRing";
import { ButtonLink } from "@/components/ui/Button";
import { Emoji } from "@/components/ui/Emoji";
import { business } from "@/content/business";
import { hero } from "@/content/home";
import { quoteHref } from "@/content/navigation";
import { clientCountClaim } from "@/content/proof";
import { partnerClaim } from "@/content/tally";
import { yearsClaim } from "@/domain/format";
import { whatsappUrl } from "@/domain/enquiry";
import styles from "./Hero.module.css";

/**
 * The home hero. Left: ticker, headline with the blue full stop, lede, two actions and three stats.
 * Right: the circuit network. The headline is real text that is visible at first paint
 * (it only sharpens in from a blur, so it never delays the largest paint).
 */
export function Hero() {
  const words = hero.title.split(" ");

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.grain} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <Ticker lead={hero.tickerLead} items={hero.ticker} />

          <h1 id="hero-title" className={styles.title}>
            {words.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <span className={styles.word} style={{ "--w": index } as CSSProperties}>
                  {word}
                  {index === words.length - 1 ? <span className={`ns-dot ${styles.dot}`}>.</span> : null}
                </span>
                {index < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>

          <p className={`lede ${styles.lede}`}>{hero.lede}</p>

          <div className={styles.actions}>
            <ButtonLink href={quoteHref} size="lg" iconEnd="arrowRight">
              Get a quote
            </ButtonLink>
            <ButtonLink href={whatsappUrl(business.whatsappE164)} variant="secondary" size="lg" icon="chat">
              Chat on WhatsApp
            </ButtonLink>
          </div>

          <ul className={styles.stats} aria-label="Next Solutions in numbers">
            <li>
              <StatRing value={yearsClaim(business.foundedYear)} suffix="+" label={`years in ${business.address.city}`} />
            </li>
            <li>
              <StatRing value={clientCountClaim.value} suffix={clientCountClaim.suffix} label={clientCountClaim.label} />
            </li>
            <li>
              <StatRing label={partnerClaim}>
                <Emoji name="years" size={34} shadow={false} eager />
              </StatRing>
            </li>
          </ul>
        </div>

        <div className={styles.visual}>
          <HeroNetwork />
        </div>
      </div>
    </section>
  );
}
