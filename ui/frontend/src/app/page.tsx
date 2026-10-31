import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Insights } from "@/components/home/Insights";
import { ProductSlider } from "@/components/home/ProductSliders";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { Statement } from "@/components/home/Statement";
import { WhyUs } from "@/components/home/WhyUs";
import { ContactBlock } from "@/components/sections/ContactBlock";
import { FreeToolsStrip } from "@/components/sections/FreeToolsStrip";
import { Hero } from "@/components/sections/Hero";
import { LicenceAdvisor } from "@/components/sections/LicenceAdvisor";
import { Process } from "@/components/sections/Process";
import { Proof } from "@/components/sections/Proof";
import { siteDescription } from "@/content/home";
import { cloudSlider, erpSlider } from "@/content/products";
import { pageMetadata } from "@/lib/seo";

const homeTitle = "Next Solutions | Tally, billing software and IT solutions in Vapi";

export const metadata = {
  ...pageMetadata({ title: homeTitle, description: siteDescription, path: "/" }),
  title: { absolute: homeTitle },
};

/** Home, in Niket's section order (spec 003, section 5.2). */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <ProductSlider
        id="billing-title"
        label="billing software"
        title="ERP and billing software"
        intro="Accounting, billing and payroll software we sell, install, customise and support."
        products={erpSlider}
      />
      <ProductSlider
        id="cloud-title"
        label="cloud services"
        title="Your Tally, anywhere"
        intro="Cloud access, mobile apps, backups and WhatsApp messaging that work with the software you already use."
        products={cloudSlider}
        tone="tint"
      />
      <Insights />
      <LicenceAdvisor />
      <ServicesGrid />
      <WhyUs />
      <Process />
      <Proof />
      <AboutTeaser />
      <FreeToolsStrip />
      <ContactBlock />
    </>
  );
}
