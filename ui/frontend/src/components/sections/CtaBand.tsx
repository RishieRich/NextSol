import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { business } from "@/content/business";
import { telHref } from "@/domain/format";
import { whatsappUrl } from "@/domain/enquiry";
import styles from "./CtaBand.module.css";

type Props = {
  title?: string;
  /** Replaces the opening-hours line, e.g. a tool's pitch. */
  text?: string;
  /** Pre-filled WhatsApp message. */
  whatsappText?: string;
  link?: { label: string; href: string };
};

export function CtaBand({ title = "Talk to someone who knows Tally", text, whatsappText, link }: Props) {
  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className="container">
        <div className={styles.band}>
          <div className={styles.copy}>
            <h2 id="cta-title" className={styles.title}>
              {title}
            </h2>
            <p className={styles.text}>
              {text ?? `${business.hours.display}, from our shop at ${business.address.line2}, ${business.address.city}.`}
            </p>
            {link ? (
              <p className={styles.text}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </p>
            ) : null}
          </div>
          <div className={styles.actions}>
            <ButtonLink href={whatsappUrl(business.whatsappE164, whatsappText)} variant="onDark" size="lg" icon="chat">
              WhatsApp us
            </ButtonLink>
            <ButtonLink href={telHref(business.phoneE164)} variant="outlineOnColor" size="lg" icon="phone">
              {business.phoneDisplay}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
