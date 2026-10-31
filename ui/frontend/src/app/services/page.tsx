import { ServicesExplorer } from "@/components/product/ServicesExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageIntro } from "@/components/sections/PageIntro";
import { Process } from "@/components/sections/Process";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Products and services",
  description:
    "TallyPrime, Tally on Cloud and Mobile, Saral Billing and PayPack, Busy, Vyapar, Real Estate CRM, bulk WhatsApp, social media, design, websites, apps, barcode, computers and CCTV in Vapi.",
  path: "/services/",
});

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        title="Products and services"
        lede="Accounting and billing software, cloud and mobile access, marketing and design, and IT, from one shop at GIDC, Vapi."
      />
      <section className={styles.list} aria-label="All products and services">
        <div className="container">
          <ServicesExplorer />
        </div>
      </section>
      <Process />
      <CtaBand title="Not sure which one you need? Ask us." />
    </>
  );
}
