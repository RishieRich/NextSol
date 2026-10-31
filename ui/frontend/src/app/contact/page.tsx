import { ContactBlock } from "@/components/sections/ContactBlock";
import { PageIntro } from "@/components/sections/PageIntro";
import { business } from "@/content/business";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Call ${business.phoneDisplay}, WhatsApp, or visit ${business.name} at ${business.address.line1}, ${business.address.line2}, ${business.address.city}. ${business.hours.display}.`,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <PageIntro
        title="Talk to us"
        lede="Call, WhatsApp or visit the shop. If you tell us what you need, we come back with the right answer the first time."
      />
      <ContactBlock withHeader={false} />
    </>
  );
}
