import { Cascade, CascadeItem } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { servicesGrid } from "@/content/home";
import { productsBySlugs } from "@/content/products";
import styles from "./ServicesGrid.module.css";

const items = productsBySlugs(servicesGrid);

/** Marketing and design, plus web, barcode, computers and CCTV, as a grid that cascades in. */
export function ServicesGrid() {
  return (
    <section className={styles.section} aria-labelledby="marketing-title">
      <div className="container">
        <SectionHeader
          id="marketing-title"
          label="marketing and design"
          title="Get noticed, then get set up"
          intro="Social media, design, websites and apps to bring customers in, and the barcode, computer and CCTV setup to serve them."
          dot
          aside={
            <ButtonLink href="/services/" variant="secondary" iconEnd="arrowRight">
              All products and services
            </ButtonLink>
          }
        />
        <Cascade className={styles.grid}>
          {items.map((product) => (
            <CascadeItem key={product.slug}>
              <ProductCard product={product} />
            </CascadeItem>
          ))}
        </Cascade>
      </div>
    </section>
  );
}
