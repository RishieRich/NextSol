import Image from "next/image";

import { business } from "@/content/business";
import { founderPhoto } from "@/content/brand";
import { productsBySlugs } from "@/content/products";
import { yearsSince } from "@/domain/format";
import styles from "./AboutStory.module.css";

const otherSoftware = productsBySlugs(["saral-billing", "saral-payroll-software", "busy", "vyapar"]).map((product) => product.name);

export function AboutStory() {
  const years = yearsSince(business.foundedYear);

  return (
    <section className={styles.section} aria-labelledby="story-title">
      <div className={`container ${styles.grid}`}>
        <figure className={styles.portrait}>
          <div className={styles.frame}>
            <Image
              src={founderPhoto.src}
              alt={`${business.founder}, founder of ${business.name}`}
              width={founderPhoto.width}
              height={founderPhoto.height}
              sizes="(max-width: 900px) 90vw, 420px"
              priority
            />
          </div>
          <figcaption>
            <strong>{business.founder}</strong>
            <span>Founder, {business.name}</span>
          </figcaption>
        </figure>

        <div className={styles.copy}>
          <h2 id="story-title">A local team you can walk in and talk to</h2>
          <p>
            {business.founder} started {business.name} in {business.foundedYear}. For {years} years the shop at{" "}
            {business.address.line2}, {business.address.city} has sold, set up and supported accounting software for
            businesses around Vapi, and built the Tally customisations they needed.
          </p>
          <p>
            Over time the work grew to cover what those same businesses asked for next: billing and payroll software,
            Tally on Cloud and on mobile, design and social media, websites and apps, and computers and CCTV. Customers mention our after-sales support more than anything
            else, and that is still how we measure ourselves.
          </p>

          <dl className={styles.facts}>
            <div>
              <dt>Started</dt>
              <dd>{business.foundedYear}</dd>
            </div>
            <div>
              <dt>Software we support</dt>
              <dd>TallyPrime, {otherSoftware.join(", ")}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>
                {business.address.line1}, {business.address.line2}, {business.address.city}
              </dd>
            </div>
            <div>
              <dt>Registered as</dt>
              <dd>
                {business.legalForm}, GSTIN {business.gstin}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
