import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { business } from "@/content/business";
import { footerLinks } from "@/content/navigation";
import { telHref, yearsClaim } from "@/domain/format";
import { whatsappUrl } from "@/domain/enquiry";
import { mapsUrl } from "@/lib/seo";
import styles from "./Footer.module.css";

export function Footer() {
  const { address } = business;
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo tone="onDark" height={72} />
          <p className={styles.tagline}>
            Tally, billing and payroll software, cloud access, design and IT for businesses in and around {address.city}. A
            local team for {yearsClaim(business.foundedYear)}+ years, since {business.foundedYear}.
          </p>
          <ul className={styles.social}>
            <li>
              <a href={business.links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Icon name="facebook" size={18} />
              </a>
            </li>
            <li>
              <a href={business.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" size={18} />
              </a>
            </li>
            <li>
              <a href={whatsappUrl(business.whatsappE164)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <Icon name="chat" size={18} />
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer" className={styles.col}>
          <h2 className={styles.heading}>Quick links</h2>
          <ul className={styles.list}>
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.heading}>Visit</h2>
          <address className={styles.address}>
            <a href={mapsUrl()} target="_blank" rel="noopener noreferrer">
              {address.line1}
              <br />
              {address.line2}, {address.city}
              <br />
              {address.state} {address.postalCode}
            </a>
          </address>
          <p className={styles.muted}>{business.hours.display}</p>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Talk to us</h2>
          <ul className={styles.list}>
            <li>
              <a href={telHref(business.phoneE164)}>{business.phoneDisplay}</a>
            </li>
            <li>
              <a href={whatsappUrl(business.whatsappE164)} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            {business.email ? (
              <li>
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </li>
            ) : null}
            <li>
              <a href={business.links.founderLinkedin} target="_blank" rel="noopener noreferrer">
                {business.founder} on LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.base}>
        <div className={`container ${styles.baseInner}`}>
          <p>
            &copy; {year} {business.name}. {business.legalForm}, GSTIN {business.gstin}.
          </p>
          <p>Tally and TallyPrime are trademarks of Tally Solutions Pvt Ltd.</p>
          <p>
            3D emoji:{" "}
            <a href="https://github.com/microsoft/fluentui-emoji" target="_blank" rel="noopener noreferrer">
              Microsoft Fluent Emoji (MIT)
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
