import type { ReactNode } from "react";

import { Cascade, CascadeItem } from "@/components/motion/Reveal";
import { Slider } from "@/components/motion/Slider";
import { CtaBand } from "@/components/sections/CtaBand";
import { SourceNote } from "@/components/tools/SourceNote";
import { ButtonLink } from "@/components/ui/Button";
import { Emoji } from "@/components/ui/Emoji";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/content/business";
import { askForPrice, productsBySlugs, type Product } from "@/content/products";
import { whatsappUrl } from "@/domain/enquiry";
import { formatPrice } from "@/domain/format";
import { serviceJsonLd } from "@/lib/seo";
import { ProductCard, productEnquiryText } from "./ProductCard";
import styles from "./ProductPage.module.css";

type Props = {
  product: Product;
  /** Replaces the default pricing block (TallyPrime uses its editions table and licence advisor). */
  pricing?: ReactNode;
  /** Replaces the default FAQ block (TallyPrime uses TallyFaq). */
  faq?: ReactNode;
  /** Extra sections after the features (TallyPrime: services, customisation explorer, invoice demo). */
  children?: ReactNode;
};

/** One layout for every product page, fed by content/products.ts. */
export function ProductPage({ product, pricing, faq, children }: Props) {
  const related = productsBySlugs(product.related);
  const enquiry = whatsappUrl(business.whatsappE164, productEnquiryText(product));

  return (
    <>
      <section className={styles.hero} aria-labelledby="page-title">
        <div className={styles.glow} aria-hidden="true" />
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>
              {product.vendor ? `By ${product.vendor}, set up` : "Set up"} and supported by {business.name}, {business.address.city}
            </p>
            <h1 id="page-title" className={styles.title}>
              {product.name}
              <span className="ns-dot">.</span>
            </h1>
            <p className="lede">{product.oneLiner}</p>
            <div className={styles.actions}>
              <ButtonLink href={enquiry} size="lg" icon="chat">
                Ask on WhatsApp
              </ButtonLink>
              <ButtonLink href="/contact/#enquiry" variant="secondary" size="lg" iconEnd="arrowRight">
                Get a quote
              </ButtonLink>
            </div>
            {product.benefits ? (
              <ul className={styles.benefits} aria-label="Key benefits">
                {product.benefits.map((benefit) => (
                  <li key={benefit}>
                    <Icon name="check" size={16} />
                    {benefit}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <span className={styles.orbit} />
            <Emoji name={product.emoji} size={160} float eager />
          </div>
        </div>
      </section>

      {product.features?.length ? (
        <section className={styles.section} aria-labelledby="features-title">
          <div className="container">
            <SectionHeader id="features-title" label="features" title={`What you get with ${product.name}`} dot />
            <Cascade className={styles.features}>
              {product.features.map((feature) => (
                <CascadeItem key={feature.title} className={`fx-card ${styles.feature}`} spotlight>
                  <Emoji name={feature.emoji} size={52} />
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </CascadeItem>
              ))}
            </Cascade>
          </div>
        </section>
      ) : null}

      {children}

      {pricing ?? (
        <section className={styles.section} aria-labelledby="pricing-title">
          <div className="container">
            <SectionHeader id="pricing-title" label="pricing" title="Pricing" dot />
            {product.prices ? (
              <>
                <ul className={styles.prices}>
                  {product.prices.items.map((item) => (
                    <li key={item.label} className={`fx-card ${item.highlight ? "fx-border" : ""} ${styles.price}`} data-loop={item.highlight ? "" : undefined}>
                      <p className={styles.priceLabel}>{item.label}</p>
                      <p className={styles.priceValue}>{item.price.amountInr === 0 ? "Free" : formatPrice(item.price)}</p>
                      <p className={styles.priceNote}>{item.note}</p>
                    </li>
                  ))}
                </ul>
                {product.prices.extra ? <p className={styles.priceExtra}>{product.prices.extra}</p> : null}
                <SourceNote source={product.prices.source} prefix="Prices from" />
              </>
            ) : (
              <div className={`fx-card ${styles.ask}`}>
                <Emoji name="whatsapp" size={56} />
                <div>
                  <p className={styles.askTitle}>{askForPrice}</p>
                  <p className={styles.askBody}>
                    Prices depend on the edition, users and setup you need. Tell us what you need and we will send you
                    the current price.
                  </p>
                </div>
                <ButtonLink href={enquiry} icon="chat">
                  Ask on WhatsApp
                </ButtonLink>
              </div>
            )}
          </div>
        </section>
      )}

      {faq ??
        (product.faqs?.length ? (
          <section className={styles.section} aria-labelledby="product-faq-title">
            <div className={`container ${styles.faqLayout}`}>
              <SectionHeader id="product-faq-title" label="questions" title="Questions we hear" dot />
              <div className={styles.faqList}>
                {product.faqs.map((item, index) => (
                  <details key={item.question} className={styles.faqItem} name={`${product.slug}-faq`} open={index === 0}>
                    <summary>
                      <span>{item.question}</span>
                      <Icon name="chevronDown" size={20} />
                    </summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null)}

      {related.length ? (
        <section className={styles.section} aria-labelledby="related-title">
          <div className="container">
            <SectionHeader id="related-title" label="related" title="Works well with" dot />
            <Slider label={`Products related to ${product.name}`}>
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </Slider>
          </div>
        </section>
      ) : null}

      <CtaBand
        title={`Talk to us about ${product.name}`}
        whatsappText={productEnquiryText(product)}
      />

      <script
        type="application/ld+json"
        // JSON-LD must be inline; the data comes only from our own content files.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(product)) }}
      />
    </>
  );
}
