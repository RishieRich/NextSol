"use client";

import { useId, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/content/business";
import { editions, priceNote } from "@/content/tally";
import { whatsappUrl } from "@/domain/enquiry";
import { formatPrice } from "@/domain/format";
import { adviseLicence, type Locations, type UsersAtOnce } from "@/domain/licence";
import styles from "./LicenceAdvisor.module.css";

type Option<T extends string> = { value: T; label: string };

const userOptions: Option<UsersAtOnce>[] = [
  { value: "one", label: "Just one person" },
  { value: "several", label: "Two or more people" },
];

const locationOptions: Option<Locations>[] = [
  { value: "one", label: "One office or factory" },
  { value: "several", label: "More than one location" },
];

function Choice<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function LicenceAdvisor() {
  const id = useId();
  const [usersAtOnce, setUsersAtOnce] = useState<UsersAtOnce>("one");
  const [locations, setLocations] = useState<Locations>("one");
  const advice = adviseLicence({ usersAtOnce, locations });
  const edition = advice.kind === "edition" ? editions[advice.edition] : null;

  const message = edition
    ? `Hello Next Solutions, I'd like today's price for ${edition.name}.`
    : "Hello Next Solutions, we work from more than one location and need help choosing a Tally setup.";

  return (
    <section className={styles.section} aria-labelledby="advisor-title">
      <div className="container">
        <SectionHeader
          id="advisor-title"
          label="which edition"
          title="Silver or Gold? Answer two questions"
          dot
          intro="Both editions have the same features. What changes is how many people can work in Tally at once."
        />

        <div className={styles.card}>
          <form className={styles.questions} onSubmit={(event) => event.preventDefault()}>
            <Choice
              legend="How many people need Tally open at the same time?"
              name={`${id}-users`}
              options={userOptions}
              value={usersAtOnce}
              onChange={setUsersAtOnce}
            />
            <Choice
              legend="Where do they work?"
              name={`${id}-locations`}
              options={locationOptions}
              value={locations}
              onChange={setLocations}
            />
          </form>

          <div className={styles.result} aria-live="polite">
            <div key={advice.kind === "edition" ? advice.edition : "consult"} className={styles.resultInner}>
              {edition ? (
                <>
                  <p className={styles.resultLabel}>Our suggestion</p>
                  <h3 className={styles.resultTitle}>{edition.name}</h3>
                  <p className={styles.reason}>{advice.reason}</p>
                  <dl className={styles.prices}>
                    <div>
                      <dt>Lifetime licence</dt>
                      <dd>{formatPrice(edition.lifetime)}</dd>
                    </div>
                    <div>
                      <dt>Or rent from</dt>
                      <dd>{formatPrice(edition.rentalFrom)}</dd>
                    </div>
                    <div>
                      <dt>TSS renewal</dt>
                      <dd>{formatPrice(edition.tssRenewal)}</dd>
                    </div>
                  </dl>
                  <p className={styles.note}>
                    {priceNote}{" "}
                    <a href={edition.lifetime.source.url} target="_blank" rel="noopener noreferrer">
                      Source: {edition.lifetime.source.label}, {edition.lifetime.source.asOf}
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <p className={styles.resultLabel}>Our suggestion</p>
                  <h3 className={styles.resultTitle}>Let&rsquo;s plan it together</h3>
                  <p className={styles.reason}>{advice.reason}</p>
                </>
              )}
              <ButtonLink href={whatsappUrl(business.whatsappE164, message)} icon="chat" className={styles.cta}>
                {edition ? "Ask for today’s price" : "Talk it through on WhatsApp"}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
