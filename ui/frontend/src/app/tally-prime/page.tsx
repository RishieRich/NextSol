import { ProductPage } from "@/components/product/ProductPage";
import { productMetadata } from "@/components/product/productMetadata";
import { CustomisationExplorer } from "@/components/sections/CustomisationExplorer";
import { EditionsTable } from "@/components/sections/EditionsTable";
import { InvoiceDemo } from "@/components/sections/InvoiceDemo";
import { LicenceAdvisor } from "@/components/sections/LicenceAdvisor";
import { TallyFaq } from "@/components/sections/TallyFaq";
import { TallySuite } from "@/components/sections/TallySuite";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProduct } from "@/content/products";
import styles from "./page.module.css";

const product = getProduct("tally-prime");

export const metadata = productMetadata(product);

/** TallyPrime: the product template plus everything from the old /tally/ page. */
export default function TallyPrimePage() {
  return (
    <ProductPage
      product={product}
      pricing={
        <>
          <LicenceAdvisor />
          <EditionsTable />
        </>
      }
      faq={<TallyFaq />}
    >
      <TallySuite detailed />
      <section className={styles.invoice} aria-labelledby="invoice-title">
        <div className={`container ${styles.invoiceGrid}`}>
          <SectionHeader
            id="invoice-title"
            label="invoice customisation"
            title="Your invoice, your layout"
            intro="Switch between a standard Tally invoice and one we customised: your logo, bank details, a payment QR and your terms."
            dot
          />
          <InvoiceDemo />
        </div>
      </section>
      <div id="customisation" className={styles.anchor}>
        <CustomisationExplorer />
      </div>
    </ProductPage>
  );
}
