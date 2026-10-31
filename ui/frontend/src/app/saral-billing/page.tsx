import { ProductPage } from "@/components/product/ProductPage";
import { productMetadata } from "@/components/product/productMetadata";
import { getProduct } from "@/content/products";

const product = getProduct("saral-billing");

export const metadata = productMetadata(product);

export default function SaralBillingPage() {
  return <ProductPage product={product} />;
}
