import { Timeline } from "@/components/about/Timeline";
import { AboutStory } from "@/components/sections/AboutStory";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageIntro } from "@/components/sections/PageIntro";
import { Proof } from "@/components/sections/Proof";
import { business } from "@/content/business";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About us",
  description: `${business.name} was started by ${business.founder} in ${business.foundedYear} and works from ${business.address.line1}, ${business.address.line2}, ${business.address.city}, selling and supporting Tally, billing and payroll software, design and IT.`,
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="About Next Solutions"
        lede={`Software, customisation, design and IT for businesses around ${business.address.city} since ${business.foundedYear}.`}
      />
      <AboutStory />
      <Timeline />
      <Proof />
      <CtaBand title="Come by the shop, or call ahead" />
    </>
  );
}
