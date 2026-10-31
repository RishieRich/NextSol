import Link from "next/link";

import { CopyButton } from "@/components/tools/CopyButton";
import { Emoji } from "@/components/ui/Emoji";
import { Icon } from "@/components/ui/Icon";
import { business } from "@/content/business";
import type { Product } from "@/content/products";
import { whatsappUrl } from "@/domain/enquiry";
import styles from "./ProductCard.module.css";

/** Prefilled WhatsApp message asking about one product. */
export function productEnquiryText(product: Product): string {
  return `Hi ${business.name}, I would like to know more about ${product.name}.`;
}

/**
 * The card used by every slider and the services grid: glass, pointer spotlight, sheen and emoji tilt.
 * Links to the product page when there is one, otherwise to WhatsApp with a prefilled message.
 */
export function ProductCard({ product, headingLevel = 3, featured = false }: { product: Product; headingLevel?: 2 | 3; featured?: boolean }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const hasPage = Boolean(product.page);

  return (
    <article className={`fx-card ${featured ? "fx-border" : ""} ${styles.card}`} data-spotlight="" data-loop={featured ? "" : undefined}>
      <div className={styles.top}>
        <Emoji name={product.emoji} size={72} />
        {product.vendor ? <span className={styles.vendor}>{product.kind === "service" ? "Service" : `By ${product.vendor}`}</span> : null}
      </div>
      <Heading className={styles.name}>{product.name}</Heading>
      <p className={styles.oneLiner}>{product.oneLiner}</p>
      <ul className={styles.bullets}>
        {product.bullets.map((bullet) => (
          <li key={bullet}>
            <Icon name="check" size={16} />
            {bullet}
          </li>
        ))}
      </ul>

      {product.referralCode ? (
        <div className={styles.referral}>
          <p>
            Referral code <code className={styles.code}>{product.referralCode}</code>
          </p>
          <CopyButton text={product.referralCode} label="Copy code" />
        </div>
      ) : null}

      <div className={styles.foot}>
        {hasPage && product.page ? (
          <Link href={product.page} className={styles.link}>
            View details<span className="visually-hidden">: {product.name}</span>
            <Icon name="arrowRight" size={16} />
          </Link>
        ) : (
          <a href={whatsappUrl(business.whatsappE164, productEnquiryText(product))} className={styles.link} target="_blank" rel="noopener noreferrer">
            Ask on WhatsApp<span className="visually-hidden"> about {product.name}</span>
            <Icon name="chat" size={16} />
          </a>
        )}
      </div>
    </article>
  );
}
