"use client";

import { AnimatePresence, LazyMotion, m } from "motion/react";
import { useState } from "react";

import { productCategories, products, type ProductCategory } from "@/content/products";
import { motionTokens } from "@/lib/motion";
import { ProductCard } from "./ProductCard";
import styles from "./ServicesExplorer.module.css";

type Filter = "all" | ProductCategory;

/**
 * Every product and service as cards, with filter chips. Filtering uses Motion layout transitions,
 * so cards slide into their new places (layout features load for this page only, via domMax).
 * Without JavaScript all cards show and the chips do nothing harmful.
 */
/** A separate chunk, so layout features never ship to the other pages. */
const loadLayoutFeatures = () => import("@/lib/motionMax").then((mod) => mod.default);

export function ServicesExplorer() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? products : products.filter((product) => product.category === filter);
  const chips: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, ...productCategories];

  return (
    <LazyMotion features={loadLayoutFeatures}>
      <div className={styles.chips} role="group" aria-label="Filter by category">
        {chips.map((chip) => {
          const count = chip.id === "all" ? products.length : products.filter((p) => p.category === chip.id).length;
          return (
            <button
              key={chip.id}
              type="button"
              className={styles.chip}
              aria-pressed={filter === chip.id}
              onClick={() => setFilter(chip.id)}
            >
              {filter === chip.id ? <m.span layoutId="chip-active" className={styles.chipBg} transition={{ duration: motionTokens.dur2, ease: motionTokens.easeOut }} /> : null}
              <span className={styles.chipLabel}>
                {chip.label} <span className={styles.count}>{count}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="visually-hidden" role="status">
        Showing {visible.length} of {products.length}
      </p>

      <m.ul layout className={styles.grid}>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((product) => (
            <m.li
              key={product.slug}
              id={product.slug}
              layout
              className={styles.item}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: motionTokens.dur1 } }}
              transition={{ duration: motionTokens.dur3, ease: motionTokens.easeOut }}
            >
              <ProductCard product={product} />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </LazyMotion>
  );
}
