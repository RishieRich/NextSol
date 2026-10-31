import Image from "next/image";

import { Cascade, CascadeItem } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolio } from "@/content/portfolio";
import { productsBySlugs } from "@/content/products";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Digital marketing and design",
  description:
    "Social media marketing, logo, packaging, brochure and visiting card design, websites, e-commerce and mobile apps for businesses in Vapi, from Next Solutions.",
  path: "/portfolio/",
});

const services = productsBySlugs(["social-media-marketing", "design", "web-and-ecommerce", "mobile-apps", "bulk-whatsapp"]);

export default function PortfolioPage() {
  return (
    <>
      <PageIntro
        title="Digital marketing and design"
        lede="Social media, design for print and screen, websites and apps, from the same team that looks after your software."
      />

      <section className={styles.section} aria-labelledby="marketing-services-title">
        <div className="container">
          <SectionHeader id="marketing-services-title" label="services" title="What we do" dot />
          <Cascade className={styles.grid}>
            {services.map((product) => (
              <CascadeItem key={product.slug}>
                <ProductCard product={product} />
              </CascadeItem>
            ))}
          </Cascade>
        </div>
      </section>

      {portfolio.length > 0 ? (
        <section className={styles.section} aria-labelledby="work-title">
          <div className="container">
            <SectionHeader id="work-title" label="our work" title="Recent work" dot />
            <Cascade className={styles.work}>
              {portfolio.map((item) => (
                <CascadeItem key={item.title} as="li" className={`fx-card ${styles.workItem}`} spotlight>
                  <Image src={item.image.src} width={item.image.width} height={item.image.height} alt={item.image.alt} />
                  <div className={styles.workText}>
                    <p className={styles.kind}>{item.kind}</p>
                    <h3>{item.title}</h3>
                    <p>{item.client}</p>
                  </div>
                </CascadeItem>
              ))}
            </Cascade>
          </div>
        </section>
      ) : null}

      <CtaBand
        title="Have a design or marketing job in mind?"
        whatsappText="Hi Next Solutions, I would like to talk about a design or marketing job."
      />
    </>
  );
}
