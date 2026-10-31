import { ProductPage } from "@/components/product/ProductPage";
import { productMetadata } from "@/components/product/productMetadata";
import { getProduct } from "@/content/products";

const product = getProduct("tally-on-cloud");

export const metadata = productMetadata(product);

export default function TallyOnCloudPage() {
  return <ProductPage product={product} />;
}
