import { Slider } from "@/components/motion/Slider";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Product } from "@/content/products";
import styles from "./ProductSliders.module.css";

type Props = {
  id: string;
  label: string;
  title: string;
  intro?: string;
  products: Product[];
  tone?: "default" | "tint";
};

/** One of the home page's two product sliders (billing software, cloud services). */
export function ProductSlider({ id, label, title, intro, products, tone = "default" }: Props) {
  return (
    <section className={`${styles.section} ${tone === "tint" ? styles.tint : ""}`} aria-labelledby={id}>
      <div className="container">
        <SectionHeader id={id} label={label} title={title} intro={intro} dot />
        <Slider label={title}>
          {products.map((product, index) => (
            <ProductCard key={product.slug} product={product} featured={index === 0} />
          ))}
        </Slider>
      </div>
    </section>
  );
}
