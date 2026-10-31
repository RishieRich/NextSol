import type { Metadata } from "next";

import type { Product } from "@/content/products";
import { pageMetadata } from "@/lib/seo";

/** Metadata for a product page, from its SEO fields in products.ts. */
export function productMetadata(product: Product): Metadata {
  return pageMetadata({
    title: product.seo?.title ?? product.name,
    description: product.seo?.description ?? product.oneLiner,
    path: product.page ?? "/services/",
  });
}
