import Image from "next/image";

import { Cascade, CascadeItem } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/content/business";
import { clientLogos, clients, reviews } from "@/content/proof";
import { yearsClaim } from "@/domain/format";
import styles from "./Proof.module.css";

/**
 * Clients and reviews. An infinite CSS marquee of client logos (or names, until logo files and
 * permission arrive), with the duplicate set aria-hidden. Pauses on hover and focus; under reduced
 * motion it becomes a static wrapped list.
 */
export function Proof() {
  const useLogos = clientLogos.length > 0;
  const renderSet = (hidden: boolean) => (
    <ul className={styles.track} aria-hidden={hidden || undefined}>
      {useLogos
        ? clientLogos.map((logo) => (
            <li key={logo.name} className={styles.logo}>
              <Image src={logo.src} width={logo.width} height={logo.height} alt={hidden ? "" : logo.name} />
            </li>
          ))
        : clients.map((client) => (
            <li key={client} className={styles.name}>
              {client}
            </li>
          ))}
    </ul>
  );

  return (
    <section className={styles.section} aria-labelledby="proof-title">
      <div className="container">
        <SectionHeader
          id="proof-title"
          label="clients"
          title="Businesses that work with us"
          intro={`${yearsClaim(business.foundedYear)}+ years of looking after Tally, software and design for businesses in and around ${business.address.city}.`}
          dot
        />
      </div>

      <div className={styles.marquee} data-loop="" tabIndex={0} role="region" aria-label="Client names">
        <div className={styles.rail}>
          {renderSet(false)}
          {renderSet(true)}
        </div>
      </div>

      <div className="container">
        <Cascade as="div" className={styles.reviews}>
          {reviews.map((review) => (
            <CascadeItem as="figure" key={review.quote} className={`fx-card ${styles.review}`}>
              <blockquote>
                <p>&ldquo;{review.quote}&rdquo;</p>
              </blockquote>
              <figcaption>{review.attribution}</figcaption>
            </CascadeItem>
          ))}
        </Cascade>
      </div>
    </section>
  );
}
