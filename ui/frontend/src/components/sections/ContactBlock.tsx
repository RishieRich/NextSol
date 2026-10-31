import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/content/business";
import { telHref } from "@/domain/format";
import { whatsappUrl } from "@/domain/enquiry";
import { mapsUrl } from "@/lib/seo";
import { EnquiryForm } from "./EnquiryForm";
import styles from "./ContactBlock.module.css";

export function ContactBlock({ withHeader = true }: { withHeader?: boolean }) {
  const { address, hours } = business;

  return (
    <section className={styles.section} aria-labelledby={withHeader ? "contact-title" : undefined} aria-label={withHeader ? undefined : "Contact details and enquiry form"}>
      <div className="container">
        {withHeader ? (
          <SectionHeader
            id="contact-title"
            label="contact"
            title="Tell us what you need"
            dot
            intro="Call, WhatsApp or drop by the shop. Or fill this in and it opens WhatsApp with your message ready."
          />
        ) : null}

        <div className={styles.grid}>
          <aside className={styles.details} aria-label="Contact details">
            <ul className={styles.list}>
              <li>
                <Icon name="phone" />
                <div>
                  <p className={styles.label}>Call</p>
                  <a href={telHref(business.phoneE164)} className={styles.value}>
                    {business.phoneDisplay}
                  </a>
                </div>
              </li>
              <li>
                <Icon name="chat" />
                <div>
                  <p className={styles.label}>WhatsApp</p>
                  <a
                    href={whatsappUrl(business.whatsappE164)}
                    className={styles.value}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start a chat
                  </a>
                </div>
              </li>
              {business.email || business.salesEmail ? (
                <li>
                  <Icon name="mail" />
                  <div>
                    <p className={styles.label}>Email</p>
                    {business.email ? (
                      <a href={`mailto:${business.email}`} className={styles.value}>
                        {business.email}
                      </a>
                    ) : null}
                    {business.salesEmail ? (
                      <p className={styles.muted}>
                        Sales:{" "}
                        <a href={`mailto:${business.salesEmail}`} className={styles.inlineLink}>
                          {business.salesEmail}
                        </a>
                      </p>
                    ) : null}
                  </div>
                </li>
              ) : null}
              <li>
                <Icon name="pin" />
                <div>
                  <p className={styles.label}>Visit</p>
                  <address className={styles.value}>
                    {address.line1}, {address.line2}
                    <br />
                    {address.city}, {address.state} {address.postalCode}
                  </address>
                  <ButtonLink href={mapsUrl()} variant="onDark" size="sm" icon="compass" className={styles.directions}>
                    Directions
                  </ButtonLink>
                </div>
              </li>
              <li>
                <Icon name="clock" />
                <div>
                  <p className={styles.label}>Hours</p>
                  <p className={styles.value}>{hours.display}</p>
                  <p className={styles.muted}>{hours.closedDisplay}</p>
                </div>
              </li>
            </ul>
          </aside>

          <div id="enquiry" className={styles.formCard}>
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
