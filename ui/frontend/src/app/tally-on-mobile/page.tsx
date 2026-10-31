import { ProductPage } from "@/components/product/ProductPage";
import { productMetadata } from "@/components/product/productMetadata";
import { getProduct } from "@/content/products";

const product = getProduct("tally-on-mobile");

export const metadata = productMetadata(product);

export default function TallyOnMobilePage() {
  return <ProductPage product={product} />;
}
