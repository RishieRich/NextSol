import { ProductPage } from "@/components/product/ProductPage";
import { productMetadata } from "@/components/product/productMetadata";
import { getProduct } from "@/content/products";

const product = getProduct("saral-payroll-software");

export const metadata = productMetadata(product);

export default function SaralPayrollPage() {
  return <ProductPage product={product} />;
}
